"use client"

import { useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import type { SupportedLanguage } from "@/lib/types/codetutor"
import { Loader2 } from "lucide-react"

interface MonacoEditorProps {
  value: string
  onChange: (code: string) => void
  language: SupportedLanguage
  errorLine?: number
}

const MONACO_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  cpp: "cpp",
  c: "c",
  java: "java",
}

export function MonacoEditor({ value, onChange, language, errorLine }: MonacoEditorProps) {
  const editorRef = useRef<any>(null)
  const decorationsRef = useRef<string[]>([])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log("[v0] Monaco Editor mounted successfully")
    editorRef.current = editor

    // Focus the editor
    editor.focus()
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  useEffect(() => {
    if (editorRef.current && errorLine) {
      console.log("[v0] Highlighting error line:", errorLine)

      const editor = editorRef.current
      const model = editor.getModel()

      if (model) {
        const newDecorations = editor.deltaDecorations(decorationsRef.current, [
          {
            range: {
              startLineNumber: errorLine,
              startColumn: 1,
              endLineNumber: errorLine,
              endColumn: model.getLineMaxColumn(errorLine),
            },
            options: {
              isWholeLine: true,
              className: "error-line-highlight",
              glyphMarginClassName: "error-line-glyph",
            },
          },
        ])
        decorationsRef.current = newDecorations

        // Scroll to error line
        editor.revealLineInCenter(errorLine)
      }
    } else if (editorRef.current && !errorLine && decorationsRef.current.length > 0) {
      console.log("[v0] Clearing error line decorations")
      editorRef.current.deltaDecorations(decorationsRef.current, [])
      decorationsRef.current = []
    }
  }, [errorLine])

  return (
    <>
      <style jsx global>{`
        .error-line-highlight {
          background: rgba(255, 0, 0, 0.1);
          border-left: 3px solid #ff0000;
        }
        .error-line-glyph {
          background: #ff0000;
          width: 3px !important;
          margin-left: 3px;
        }
      `}</style>
      <div className="relative w-full h-full">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language] || "javascript"}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: true,
            renderLineHighlight: "all",
            matchBrackets: "always",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            quickSuggestions: true,
            tabCompletion: "on",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoIndent: "full",
            formatOnPaste: true,
            formatOnType: true,
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-background border border-pop rounded">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-pop" />
                <p className="text-sm text-foreground/60">Loading Monaco Editor...</p>
              </div>
            </div>
          }
        />
      </div>
    </>
  )
}
