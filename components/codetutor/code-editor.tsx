"use client"

import { useEffect, useRef } from "react"
import type { SupportedLanguage } from "@/lib/types/codetutor"

interface CodeEditorProps {
  value: string
  onChange: (code: string) => void
  language: SupportedLanguage
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<any>(null)
  const editorInstanceRef = useRef<any>(null)

  useEffect(() => {
    const loadMonaco = async () => {
      if (typeof window !== "undefined" && !monacoRef.current) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.50.0/min/vs/loader.min.js"
        script.onload = () => {
          if (window.require) {
            window.require.config({
              paths: {
                vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.50.0/min/vs",
              },
            })

            window.require(["vs/editor/editor.main"], () => {
              monacoRef.current = window.monaco

              if (editorRef.current && !editorInstanceRef.current) {
                editorInstanceRef.current = monacoRef.current.editor.create(editorRef.current, {
                  value: value,
                  language: language,
                  theme: "vs-dark",
                  automaticLayout: true,
                  minimap: { enabled: true },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                })

                editorInstanceRef.current.onDidChangeModelContent(() => {
                  const currentCode = editorInstanceRef.current.getValue()
                  onChange(currentCode)
                })
              }
            })
          }
        }
        document.head.appendChild(script)
      }
    }

    loadMonaco()

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose()
        editorInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (editorInstanceRef.current && monacoRef.current) {
      monacoRef.current.editor.setTheme("vs-dark")
      const model = editorInstanceRef.current.getModel()
      if (model) {
        monacoRef.current.languages.setMonarchTokensProvider(language, {})
      }
    }
  }, [language])

  return (
    <div
      ref={editorRef}
      className="w-full h-full rounded-lg border border-border bg-background overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  )
}

declare global {
  interface Window {
    require: any
    monaco: any
  }
}
