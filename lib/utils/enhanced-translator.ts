export interface ExplanationContext {
  errorType: string
  code: string
  errorLine?: string
  language: string
}

export const BEGINNER_TIPS: Record<string, { english: string; hindi: string }> = {
  variables: {
    english: "Tip: Always declare variables before using them. Use let, const, or var in JavaScript.",
    hindi: "Tip: Variables ko use karne se pehle declare karein. JavaScript mein let, const, ya var use karein.",
  },
  loops: {
    english: "Tip: Make sure your loop has a stopping condition, or it will run forever.",
    hindi: "Tip: Loop ke paas stopping condition honi chahiye, nahi toh yeh forever chalega.",
  },
  functions: {
    english: "Tip: Check that your function is called correctly with the right number of arguments.",
    hindi: "Tip: Function ko sahi tarike se call karein aur sahi number of arguments de.",
  },
  arrays: {
    english: "Tip: Array indices start from 0, not 1. So the first element is at index 0.",
    hindi: "Tip: Array index 1 se nahi, 0 se start hota hai. Pehla element index 0 par hai.",
  },
  scope: {
    english: "Tip: Variables have scope. A variable inside a function can't be used outside it.",
    hindi: "Tip: Variables ka scope hota hai. Function ke andar variable function ke bahar use nahi ho sakte.",
  },
  null: {
    english: "Tip: null means 'no value'. Always check if something is null before using it.",
    hindi: "Tip: null ka matlab 'no value'. Use karne se pehle null check karein.",
  },
}

export function getContextualTip(errorType: string): { english: string; hindi: string } {
  const lowerError = errorType.toLowerCase()

  if (lowerError.includes("variable")) return BEGINNER_TIPS.variables
  if (lowerError.includes("loop")) return BEGINNER_TIPS.loops
  if (lowerError.includes("function")) return BEGINNER_TIPS.functions
  if (lowerError.includes("index") || lowerError.includes("array")) return BEGINNER_TIPS.arrays
  if (lowerError.includes("scope") || lowerError.includes("reference")) return BEGINNER_TIPS.scope
  if (lowerError.includes("null") || lowerError.includes("undefined")) return BEGINNER_TIPS.null

  return {
    english: "Review your code carefully and check the error message for clues.",
    hindi: "Apna code carefully dekhein aur error message padhen.",
  }
}

export function generateDetailedExplanation(
  errorType: string,
  code: string,
  language: "english" | "hindi" = "english",
): string {
  const explanations: Record<string, Record<string, string>> = {
    "Type Error": {
      english: `This happens when you use a value as if it were a different type. In your code, you're trying to perform an operation that doesn't work with that data type. For example:
• Calling a method on null or undefined
• Adding a number to a string using +
• Calling a property on a primitive value
Check your variable types and ensure they match what the operation expects.`,
      hindi: `Yeh tab hota hai jab aap kisi value ko galat type ke taur par use karte ho. Aapke code mein, aap aisa operation kar rahe ho jo us data type ke saath work nahi karta.
Misal:
• null ya undefined par method call karna
• Number ko string ke saath + se add karna
• Property ko primitive value par call karna
Apne variables ke types check karein aur ensure karein ki operation ke saath match ho rahe hain.`,
    },
    "Reference Error": {
      english: `You're trying to use a variable or function that hasn't been defined or isn't in scope:
• Misspelled variable name
• Variable declared after it was used
• Function not imported or defined
Check spelling and make sure everything is declared before use.`,
      hindi: `Aap aisa variable ya function use kar rahe ho jo define nahi hai ya scope mein nahi hai:
• Variable ka naam galat likha ho
• Variable use hone ke baad declare ho
• Function import ya define nahi hua ho
Spelling check karein aur ensure karein sab kuch use se pehle declare hai.`,
    },
    "Syntax Error": {
      english: `Your code has grammatical mistakes that prevent it from running:
• Missing closing bracket, parenthesis, or quote
• Missing colon after if/for/while
• Wrong operator or keyword
Fix the syntax and your code should run.`,
      hindi: `Aapke code mein grammatical mistakes hain jo use chalane se rokti hain:
• Closing bracket, parenthesis, ya quote missing hai
• if/for/while ke baad colon missing hai
• Wrong operator ya keyword
Syntax fix karein aur code chal jayega.`,
    },
  }

  for (const [key, value] of Object.entries(explanations)) {
    if (errorType.includes(key)) {
      return language === "english" ? value.english : value.hindi
    }
  }

  return language === "english"
    ? "Review your code and check the error message for specific details."
    : "Apna code review karein aur error message check karein details ke liye."
}
