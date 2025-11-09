interface CodeIssue {
  type: string
  line?: number
  description: string
  fix: string
}

export function analyzeCodeForIssues(code: string, language: string, errorMessage?: string): CodeIssue[] {
  const issues: CodeIssue[] = []
  const lines = code.split("\n")

  // Common patterns across languages
  const patterns = {
    // Missing semicolons (JavaScript/C++)
    missingSemicolon: /[^;{}\s]\s*$/,
    // Undefined variables
    undefinedVar: /\b(console|print|document|window)\s*\.\s*(\w+)/,
    // Array index issues
    arrayAccess: /\[(\d+)\]/,
    // Missing brackets
    missingBracket: /\{[^}]*$/,
    // Comparison vs assignment
    assignmentInCondition: /if\s*\([^=]*=[^=]/,
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) return

    // Check for common issues based on language
    if (language === "javascript" || language === "typescript") {
      // Missing semicolon
      if (trimmed.match(/^(let|const|var|return)\s+/) && !trimmed.endsWith(";") && !trimmed.endsWith("{")) {
        issues.push({
          type: "Syntax Warning",
          line: index + 1,
          description: "Missing semicolon at end of statement",
          fix: `Add semicolon: ${trimmed};`,
        })
      }

      // Using = instead of === in conditions
      if (patterns.assignmentInCondition.test(trimmed)) {
        issues.push({
          type: "Logic Error",
          line: index + 1,
          description: "Using assignment (=) instead of comparison (===) in condition",
          fix: trimmed.replace(/=([^=])/, "===$1"),
        })
      }
    }

    if (language === "python") {
      // Indentation issues
      const indent = line.match(/^\s*/)?.[0].length || 0
      if (indent % 4 !== 0 && indent > 0) {
        issues.push({
          type: "Indentation Error",
          line: index + 1,
          description: "Python requires 4-space indentation",
          fix: "Use 4 spaces for each indentation level",
        })
      }

      // Missing colon
      if (trimmed.match(/^(if|for|while|def|class)\s+.*[^:]$/) && !trimmed.endsWith(":")) {
        issues.push({
          type: "Syntax Error",
          line: index + 1,
          description: "Missing colon after control statement",
          fix: `${trimmed}:`,
        })
      }
    }

    // Check for undefined variables (basic heuristic)
    if (errorMessage?.toLowerCase().includes("undefined") || errorMessage?.toLowerCase().includes("not defined")) {
      const match = errorMessage.match(/['"](\w+)['"]/)?.[1]
      if (match && line.includes(match)) {
        issues.push({
          type: "Reference Error",
          line: index + 1,
          description: `Variable '${match}' is used but not defined`,
          fix: `Declare '${match}' before using it`,
        })
      }
    }
  })

  return issues
}

export function generateFixedCode(code: string, issues: CodeIssue[]): string {
  const fixed = code
  const lines = fixed.split("\n")

  issues.forEach((issue) => {
    if (issue.line && issue.fix.includes(":")) {
      const lineIndex = issue.line - 1
      if (lines[lineIndex]) {
        // Apply simple fixes
        if (issue.type === "Syntax Error" && issue.description.includes("colon")) {
          lines[lineIndex] = lines[lineIndex].trimEnd() + ":"
        }
        if (issue.type === "Syntax Warning" && issue.description.includes("semicolon")) {
          lines[lineIndex] = lines[lineIndex].trimEnd() + ";"
        }
        if (issue.type === "Logic Error" && issue.description.includes("assignment")) {
          lines[lineIndex] = lines[lineIndex].replace(/=([^=])/, "===$1")
        }
      }
    }
  })

  return lines.join("\n")
}

export function generateAlternativeFixes(
  code: string,
  errorType: string,
  language: string,
): Array<{
  title: string
  code: string
  explanation: string
}> {
  const alternatives = []

  if (errorType.includes("Type Error")) {
    alternatives.push({
      title: "Add Type Checking",
      code:
        language === "javascript"
          ? `if (typeof variable !== 'undefined' && variable !== null) {\n  // Your code here\n}`
          : `if variable is not None:\n    # Your code here`,
      explanation: "Check if the variable exists before using it",
    })

    alternatives.push({
      title: "Use Default Values",
      code:
        language === "javascript"
          ? `const value = variable || defaultValue;`
          : `value = variable if variable else default_value`,
      explanation: "Provide a fallback value to prevent errors",
    })
  }

  if (errorType.includes("Reference Error") || errorType.includes("Undefined")) {
    alternatives.push({
      title: "Declare Variable",
      code: language === "javascript" ? `let variableName = initialValue;` : `variable_name = initial_value`,
      explanation: "Make sure to declare the variable before using it",
    })

    alternatives.push({
      title: "Check Scope",
      code:
        language === "javascript"
          ? `function example() {\n  let localVar = 'value';\n  // Use localVar here\n}`
          : `def example():\n    local_var = 'value'\n    # Use local_var here`,
      explanation: "Ensure the variable is in the correct scope",
    })
  }

  if (errorType.includes("Syntax Error")) {
    alternatives.push({
      title: "Fix Syntax",
      code: "Check for missing brackets, parentheses, or semicolons",
      explanation: "Review the syntax rules for " + language,
    })
  }

  // Always add a general debugging approach
  alternatives.push({
    title: "Debug Step-by-Step",
    code:
      language === "javascript"
        ? `console.log('Debug:', variable);\n// Check the output`
        : `print('Debug:', variable)\n# Check the output`,
    explanation: "Add logging to understand what values your variables have",
  })

  return alternatives.slice(0, 3) // Return top 3 alternatives
}

export function extractVariableSnapshot(code: string, language: string): Record<string, string> {
  const snapshot: Record<string, string> = {}
  const lines = code.split("\n")

  lines.forEach((line) => {
    // JavaScript/TypeScript variable declarations
    if (language === "javascript" || language === "typescript") {
      const match = line.match(/(?:let|const|var)\s+(\w+)\s*=\s*(.+?);?$/)
      if (match) {
        snapshot[match[1]] = match[2].trim().replace(/;$/, "")
      }
    }

    // Python variable assignments
    if (language === "python") {
      const match = line.match(/^(\w+)\s*=\s*(.+)$/)
      if (match && !line.trim().startsWith("#")) {
        snapshot[match[1]] = match[2].trim()
      }
    }

    // C++ variable declarations
    if (language === "cpp" || language === "c++") {
      const match = line.match(/(?:int|float|double|string|char|bool)\s+(\w+)\s*=\s*(.+?);?$/)
      if (match) {
        snapshot[match[1]] = match[2].trim().replace(/;$/, "")
      }
    }
  })

  return snapshot
}

export function analyzeCodeIntelligently(
  code: string,
  language: string,
  errorMessage?: string,
): {
  hasError: boolean
  errorType: string
  severity: "critical" | "warning" | "info"
  rootCause: string
  explanationEnglish: string
  explanationHindi: string
  fixedCode: string
  fixExplanation: string
  alternatives: Array<{ title: string; code: string; explanation: string }>
  learningResources: Array<{ title: string; description: string }>
  learningTip: string
  complexity: string
  confidence: number
} {
  const issues = analyzeCodeForIssues(code, language, errorMessage)
  const trimmedCode = code.trim()

  // Check if code is actually error-free
  const isSimpleValidCode =
    (language === "python" && /^print\s*\(/.test(trimmedCode)) ||
    (language === "javascript" && /^console\.log\s*\(/.test(trimmedCode)) ||
    (language === "cpp" && /^(cout|printf)\s*/.test(trimmedCode))

  if (issues.length === 0 && !errorMessage) {
    // Code appears to be valid
    return {
      hasError: false,
      errorType: "No Error",
      severity: "info",
      rootCause: "No errors detected in the code",
      explanationEnglish: "Your code looks good! It follows proper syntax and should execute correctly.",
      explanationHindi: "आपका कोड अच्छा दिखता है! यह सही सिंटैक्स का पालन करता है।",
      fixedCode: code,
      fixExplanation: "No changes needed - code is correct",
      alternatives: generateImprovementSuggestions(code, language),
      learningResources: generateLearningResources(code, language),
      learningTip: generateLearningTip(code, language),
      complexity: calculateComplexity(code),
      confidence: 0.95,
    }
  }

  // Code has issues
  const primaryIssue = issues[0] || {
    type: "Unknown Error",
    description: errorMessage || "Code analysis detected potential issues",
    fix: "Review your code for syntax and logic errors",
  }

  const fixedCode = issues.length > 0 ? generateFixedCode(code, issues) : code

  return {
    hasError: true,
    errorType: primaryIssue.type,
    severity: primaryIssue.type.includes("Error") ? "critical" : "warning",
    rootCause: primaryIssue.description,
    explanationEnglish: generateExplanation(primaryIssue, language, "english"),
    explanationHindi: generateExplanation(primaryIssue, language, "hindi"),
    fixedCode: fixedCode,
    fixExplanation: primaryIssue.fix,
    alternatives: generateAlternativeFixes(code, primaryIssue.type, language),
    learningResources: generateLearningResources(code, language, primaryIssue.type),
    learningTip: generateLearningTip(code, language, primaryIssue.type),
    complexity: calculateComplexity(code),
    confidence: 0.85,
  }
}

function generateExplanation(issue: CodeIssue, language: string, lang: "english" | "hindi"): string {
  if (lang === "hindi") {
    if (issue.type.includes("Syntax")) {
      return `सिंटैक्स त्रुटि: ${issue.description}। कृपया अपने कोड की जांच करें।`
    }
    if (issue.type.includes("Logic")) {
      return `लॉजिक त्रुटि: ${issue.description}। अपने कोड की समीक्षा करें।`
    }
    return `त्रुटि: ${issue.description}। कृपया इसे ठीक करें।`
  }

  return `${issue.type}: ${issue.description}. ${issue.fix}`
}

function generateImprovementSuggestions(
  code: string,
  language: string,
): Array<{ title: string; code: string; explanation: string }> {
  const suggestions = []

  if (language === "python") {
    suggestions.push({
      title: "Add Error Handling",
      code: `try:\n    ${code.trim()}\nexcept Exception as e:\n    print(f"Error: {e}")`,
      explanation: "Wrap code in try-except to handle potential errors gracefully",
    })

    suggestions.push({
      title: "Add Type Hints",
      code: `def greet(name: str) -> None:\n    print(f"Hello, {name}")`,
      explanation: "Use type hints to make code more maintainable and catch errors early",
    })

    suggestions.push({
      title: "Use f-strings",
      code: `name = "World"\nprint(f"Hello, {name}!")`,
      explanation: "f-strings are more readable and efficient than concatenation",
    })
  } else if (language === "javascript") {
    suggestions.push({
      title: "Use const/let",
      code: `const message = "Hello";\nconsole.log(message);`,
      explanation: "Prefer const/let over var for better scoping and immutability",
    })

    suggestions.push({
      title: "Add Error Handling",
      code: `try {\n  ${code.trim()}\n} catch (error) {\n  console.error(error);\n}`,
      explanation: "Use try-catch to handle potential runtime errors",
    })

    suggestions.push({
      title: "Use Template Literals",
      code: `const name = "World";\nconsole.log(\`Hello, \${name}!\`);`,
      explanation: "Template literals are cleaner than string concatenation",
    })
  }

  return suggestions.slice(0, 3)
}

function generateLearningResources(
  code: string,
  language: string,
  errorType?: string,
): Array<{ title: string; description: string }> {
  const resources = []

  if (language === "python") {
    resources.push(
      { title: "Python Basics", description: "Learn fundamental Python syntax and concepts" },
      { title: "Error Handling in Python", description: "Master try-except blocks and exception handling" },
      { title: "Python Best Practices", description: "Write clean, Pythonic code following PEP 8" },
    )
  } else if (language === "javascript") {
    resources.push(
      { title: "JavaScript Fundamentals", description: "Core concepts of JavaScript programming" },
      { title: "Modern JavaScript (ES6+)", description: "Learn const, let, arrow functions, and more" },
      { title: "Debugging JavaScript", description: "Tools and techniques for finding and fixing bugs" },
    )
  } else if (language === "cpp" || language === "c++") {
    resources.push(
      { title: "C++ Basics", description: "Learn C++ syntax and core concepts" },
      { title: "Memory Management", description: "Understand pointers and memory allocation" },
      { title: "STL Containers", description: "Master vectors, maps, and other containers" },
    )
  } else if (language === "java") {
    resources.push(
      { title: "Java Fundamentals", description: "Core Java programming concepts" },
      { title: "Object-Oriented Programming", description: "Classes, objects, and inheritance in Java" },
      { title: "Exception Handling", description: "Try-catch blocks and error management" },
    )
  }

  return resources.slice(0, 3)
}

function generateLearningTip(code: string, language: string, errorType?: string): string {
  if (errorType?.includes("Syntax")) {
    return "Always check your syntax carefully. Use an IDE with syntax highlighting to catch errors early."
  }

  if (errorType?.includes("Logic")) {
    return "Break down complex logic into smaller steps. Test each part separately to find issues faster."
  }

  if (errorType?.includes("Reference") || errorType?.includes("Undefined")) {
    return "Declare all variables before using them. Check variable names for typos and scope issues."
  }

  // General tips for error-free code
  const tips = [
    "Write small functions that do one thing well. This makes debugging much easier.",
    "Use meaningful variable names. Code is read more often than it's written.",
    "Test your code frequently. Don't wait until the end to run it for the first time.",
    "Add comments to explain complex logic. Your future self will thank you.",
  ]

  return tips[Math.floor(Math.random() * tips.length)]
}

function calculateComplexity(code: string): string {
  const lines = code.split("\n").filter((line) => line.trim() && !line.trim().startsWith("//"))

  if (lines.length <= 5) return "Low"
  if (lines.length <= 15) return "Medium"
  return "High"
}
