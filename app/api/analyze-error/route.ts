import type { CodeAnalysisRequest, ErrorAnalysis } from "@/lib/types/error-analysis"

const GEMINI_API_KEY = "AIzaSyDFlKPBXDUbo-unO6yy6m5vPB4Qc683iCk"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function POST(request: Request) {
  try {
    const body: CodeAnalysisRequest = await request.json()
    const { code, language, errorMessage } = body

    if (!code || !language) {
      return Response.json({ error: "Code and language are required" }, { status: 400 })
    }

    const prompt = `You are an expert code debugger. Analyze this ${language} code and provide a detailed analysis.

Code:
\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error Message: ${errorMessage}` : ""}

Provide your analysis in the following JSON format:
{
  "errorType": "Brief error title (max 60 chars) or 'No Errors Found' if code is correct",
  "severity": "critical" | "warning" | "info",
  "rootCause": "Brief root cause explanation (max 100 chars). If no errors, write 'Code is syntactically correct and performs as expected.'",
  "explanationEnglish": "Brief explanation in English (max 150 chars). If no errors, explain what the code does.",
  "explanationHindi": "Brief explanation in Hindi (max 150 chars). If no errors, explain what the code does in Hindi.",
  "fixedCode": "The corrected code or improved version. If no errors, return the same code or suggest minor improvements.",
  "fixExplanation": "Brief fix explanation (max 100 chars). If no errors, write 'No fixes needed' or suggest improvements.",
  "complexity": "Low" | "Medium" | "High",
  "confidence": 85-99 (number),
  "alternatives": [
    {
      "title": "Brief title (max 30 chars)",
      "code": "Alternative code solution or improvement",
      "explanation": "Brief description (max 80 chars)"
    }
  ] (provide EXACTLY 3 alternatives specific to this code),
  "variableSnapshot": {
    "variableName": "value"
  } (extract ACTUAL variables with their values from THIS code),
  "learningResources": [
    {"title": "Resource title (max 50 chars)", "description": "Brief description (max 80 chars)"}
  ] (provide EXACTLY 3 resources relevant to THIS specific code's concepts),
  "learningTip": "Brief learning tip (max 150 chars) relevant to this SPECIFIC code"
}

Important: 
- Keep ALL text brief to fit UI layout
- ALWAYS provide EXACTLY 3 alternatives relevant to THIS specific code
- ALWAYS provide EXACTLY 3 learning resources relevant to THIS specific code's concepts
- For variableSnapshot, extract ACTUAL variables with their values from THIS code
- Learning resources MUST be specific to the concepts/patterns used in THIS code
- Learning tip MUST be specific to THIS code, not generic advice
- If code has NO errors, still provide improvements and relevant learning resources
- IMPORTANT: Return ONLY valid JSON with no markdown, no explanations, just the JSON object`

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Gemini API error:", errorData)
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponse) {
      throw new Error("No response from Gemini API")
    }

    const firstBraceIndex = aiResponse.indexOf("{")
    const lastBraceIndex = aiResponse.lastIndexOf("}")

    if (firstBraceIndex === -1 || lastBraceIndex === -1 || firstBraceIndex >= lastBraceIndex) {
      throw new Error("Could not find valid JSON in AI response")
    }

    const jsonString = aiResponse.substring(firstBraceIndex, lastBraceIndex + 1)

    const sanitizedJson = jsonString
      .replace(/[\n\r\t]/g, " ") // Replace newlines/tabs with space
      .replace(/\\(?!["\\/bfnrtu])/g, "\\\\") // Escape unescaped backslashes
      .replace(/"([^"\\]|\\.)*"/g, (match) => {
        // Fix unescaped quotes inside string values
        return match.replace(/(?<!\\)"/g, '\\"').replace(/\\\\"/g, '\\"')
      })

    let aiAnalysis
    try {
      aiAnalysis = JSON.parse(sanitizedJson)
    } catch (parseError) {
      console.error("[v0] JSON parse failed, attempting recovery:", parseError)

      // Try to extract key fields manually as fallback
      const errorTypeMatch = jsonString.match(/"errorType"\s*:\s*"([^"]*)"/)
      const rootCauseMatch = jsonString.match(/"rootCause"\s*:\s*"([^"]*)"/)

      aiAnalysis = {
        errorType: errorTypeMatch?.[1] || "Analysis Error",
        severity: "warning",
        explanationEnglish: "Error analyzing code",
        explanationHindi: "कोड का विश्लेषण करने में त्रुटि",
        rootCause: rootCauseMatch?.[1] || "Could not parse AI response",
        fixedCode: code,
        fixExplanation: "Please review the code manually",
        complexity: "Medium",
        confidence: 50,
        alternatives: [],
        variableSnapshot: {},
        learningResources: [],
        learningTip: "Use console.log to debug",
      }
    }

    if (!aiAnalysis.alternatives || aiAnalysis.alternatives.length < 3) {
      // Generate fallbacks based on the actual code if AI didn't provide enough
      const fallbackAlternatives = generateAlternatives(code, language, aiAnalysis.alternatives || [])
      aiAnalysis.alternatives = fallbackAlternatives
    }

    if (!aiAnalysis.learningResources || aiAnalysis.learningResources.length < 3) {
      const fallbackResources = generateLearningResources(language, code, aiAnalysis.learningResources || [])
      aiAnalysis.learningResources = fallbackResources
    }

    // Extract variable snapshot from code or use AI's snapshot
    const variableSnapshot = aiAnalysis.variableSnapshot || extractVariableSnapshot(code, language)

    const analysis: ErrorAnalysis = {
      errorType: aiAnalysis.errorType,
      severity: aiAnalysis.severity,
      explanation: {
        english: aiAnalysis.explanationEnglish,
        hindi: aiAnalysis.explanationHindi,
      },
      rootCause: aiAnalysis.rootCause,
      suggestedFix: {
        code: aiAnalysis.fixedCode,
        explanation: aiAnalysis.fixExplanation,
      },
      complexity: aiAnalysis.complexity !== "Low" ? `Complexity: ${aiAnalysis.complexity}` : null,
      confidence: aiAnalysis.confidence,
      alternatives: aiAnalysis.alternatives.slice(0, 3), // Ensure exactly 3
      variableSnapshot: Object.keys(variableSnapshot).length > 0 ? variableSnapshot : undefined,
      learningResources: aiAnalysis.learningResources.slice(0, 3), // Ensure exactly 3
      learningTip: aiAnalysis.learningTip,
    }

    return Response.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("[v0] Error analyzing code:", error)
    return Response.json(
      { error: "Failed to analyze code", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

function extractVariableSnapshot(code: string, language: string): Record<string, string> {
  const snapshot: Record<string, string> = {}

  if (language === "python") {
    const varMatches = code.matchAll(/(\w+)\s*=\s*([^=\n]+)/g)
    for (const match of varMatches) {
      snapshot[match[1]] = match[2].trim()
    }
  } else if (language === "javascript" || language === "typescript") {
    const varMatches = code.matchAll(/(?:let|const|var)\s+(\w+)\s*=\s*([^;\n]+)/g)
    for (const match of varMatches) {
      snapshot[match[1]] = match[2].trim()
    }
  }

  return snapshot
}

// Helper function to generate code-specific alternatives
function generateAlternatives(
  code: string,
  language: string,
  existing: any[],
): Array<{ title: string; code: string; explanation: string }> {
  const alternatives = [...existing]

  // Add generic improvements based on language if we don't have 3
  const genericAlternatives = [
    {
      title: "Add Error Handling",
      code: `try {\n  ${code.split("\n").slice(0, 3).join("\n  ")}\n} catch (error) {\n  console.error(error)\n}`,
      explanation: "Wrap code in try-catch to handle potential errors gracefully",
    },
    {
      title: "Add Input Validation",
      code: `// Add validation before processing\nif (input === null || input === undefined) {\n  throw new Error('Invalid input')\n}\n${code.split("\n").slice(0, 2).join("\n")}`,
      explanation: "Validate inputs before processing to prevent runtime errors",
    },
    {
      title: "Add Type Checking",
      code:
        language === "typescript"
          ? `// Use TypeScript types\nfunction processData(data: string[]): void {\n  // Implementation\n}`
          : `// Add runtime type checking\nif (typeof data !== 'object') {\n  throw new TypeError('Expected array')\n}`,
      explanation: "Add type checking to catch type-related errors early",
    },
  ]

  while (alternatives.length < 3) {
    alternatives.push(genericAlternatives[alternatives.length])
  }

  return alternatives.slice(0, 3)
}

// Helper function to generate language-specific learning resources
function generateLearningResources(
  language: string,
  code: string,
  existing: any[],
): Array<{ title: string; description: string }> {
  const resources = [...existing]

  const languageResources: Record<string, Array<{ title: string; description: string }>> = {
    javascript: [
      { title: "JavaScript Error Handling", description: "Learn about try-catch and error handling patterns" },
      { title: "JavaScript Best Practices", description: "Modern JavaScript coding standards and patterns" },
      { title: "Debugging JavaScript", description: "Tools and techniques for debugging JS code" },
    ],
    typescript: [
      { title: "TypeScript Type System", description: "Understanding TypeScript's type checking" },
      { title: "TypeScript Best Practices", description: "Writing type-safe TypeScript code" },
      { title: "TypeScript Error Handling", description: "Handling errors in TypeScript applications" },
    ],
    python: [
      { title: "Python Exception Handling", description: "Learn about Python's try-except blocks" },
      { title: "Python Best Practices", description: "PEP 8 and Python coding standards" },
      { title: "Python Debugging", description: "Using pdb and debugging tools in Python" },
    ],
    java: [
      { title: "Java Exception Handling", description: "Understanding Java's exception hierarchy" },
      { title: "Java Best Practices", description: "Writing clean and maintainable Java code" },
      { title: "Java Debugging", description: "Using IDE debuggers and logging in Java" },
    ],
    cpp: [
      { title: "C++ Error Handling", description: "Exception handling and error codes in C++" },
      { title: "C++ Best Practices", description: "Modern C++ coding standards" },
      { title: "C++ Debugging", description: "Using GDB and other C++ debugging tools" },
    ],
    c: [
      { title: "C Error Handling", description: "Error codes and errno in C programming" },
      { title: "C Best Practices", description: "Writing safe and efficient C code" },
      { title: "C Debugging", description: "Using GDB and Valgrind for C debugging" },
    ],
  }

  const defaultResources = languageResources[language.toLowerCase()] || languageResources["javascript"]

  while (resources.length < 3) {
    resources.push(defaultResources[resources.length])
  }

  return resources.slice(0, 3)
}
