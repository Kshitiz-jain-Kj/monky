interface Translation {
  english: string
  hindi: string
}

const ERROR_TRANSLATIONS: Record<string, { english: string; hindi: string }> = {
  "cannot read property of undefined": {
    english:
      "You tried to access a property on something that doesn't exist. Make sure the variable is defined before using it.",
    hindi:
      "Aapne kisi aisi cheez par property access karne ki koshish ki jo exist nahi karti. Pehle check karein ki variable defined hai.",
  },
  "is not iterable": {
    english:
      "You tried to loop over a number or value that can't be looped. Use range() for numbers or ensure it's a list/array.",
    hindi:
      "Aapne number par loop lagaya jo loop nahi ho sakta. Numerals ke liye range() use karein ya array/list ensure karein.",
  },
  "syntax error": {
    english: "Your code has incorrect grammar. Check for missing brackets, colons, or semicolons.",
    hindi: "Aapke code mein grammar galat hai. Brackets, colons, ya semicolons check karein.",
  },
  "undefined variable": {
    english: "You used a variable that was never created. Declare it with var, let, const, or in a function parameter.",
    hindi:
      "Aapne ek variable use kiya jo kabhi declare nahi hua. Var, let, const se declare karein ya function parameter mein add karein.",
  },
  "type error": {
    english:
      "You tried to use a value as a different type than it is. For example, treating a number like a string or vice versa.",
    hindi: "Aapne value ko alag type ke taur par use kiya. Jaise number ko string ke taur par treat karna.",
  },
  "reference error": {
    english: "You tried to use a variable or function that doesn't exist or isn't in the current scope.",
    hindi: "Aapne aisa variable ya function use kiya jo exist nahi karta ya current scope mein nahi hai.",
  },
  "indentation error": {
    english: "Your code indentation is wrong. Python requires proper spacing to show code blocks.",
    hindi: "Aapke code ka indentation galat hai. Python ko proper spacing chahiye code blocks ke liye.",
  },
  "index out of range": {
    english: "You tried to access an element at a position that doesn't exist in your list or array.",
    hindi: "Aapne list mein aisa index access kiya jo exist nahi karta.",
  },
  "cannot assign to operator": {
    english: "You tried to assign a value to something that can't hold a value, like an operator.",
    hindi: "Aapne kisi aisi cheez ko value assign karne ki koshish ki jo value hold nahi kar sakti.",
  },
  "module not found": {
    english: "You tried to import a library or module that doesn't exist or isn't installed.",
    hindi: "Aapne kisi library ko import kiya jo install nahi hai.",
  },
}

export function getSimpleExplanation(
  errorMessage: string,
  complexity: "beginner" | "intermediate" | "expert" = "beginner",
): { english: string; hindi: string } {
  const lowerError = errorMessage.toLowerCase()

  for (const [pattern, translation] of Object.entries(ERROR_TRANSLATIONS)) {
    if (lowerError.includes(pattern)) {
      if (complexity === "beginner") {
        return translation
      } else if (complexity === "intermediate") {
        return {
          english: `${translation.english} This is a common mistake in programming.`,
          hindi: `${translation.hindi} Yeh programming mein ek common galti hai.`,
        }
      } else {
        return {
          english: `${translation.english} Debug by checking the stack trace and variable states at the error point.`,
          hindi: `${translation.hindi} Stack trace ko dekhkar variables ke values check karein.`,
        }
      }
    }
  }

  return {
    english: `Error: ${errorMessage}. Review your code logic, syntax, and variable types.`,
    hindi: `Error: ${errorMessage}. Apna code logic, syntax aur variable types check karein.`,
  }
}

export function translateTechnicalToSimple(technical: string): Translation {
  // This will be enhanced by AI in the API route
  return {
    english: technical,
    hindi: technical,
  }
}
