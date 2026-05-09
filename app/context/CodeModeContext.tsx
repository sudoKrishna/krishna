"use client";

import { createContext, useContext, useState } from "react";

const CodeModeContext = createContext<any>(null);

export function CodeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [codeMode, setCodeMode] = useState(false);

  return (
    <CodeModeContext.Provider value={{ codeMode, setCodeMode }}>
      {children}
    </CodeModeContext.Provider>
  );
}

export function useCodeMode() {
  const context = useContext(CodeModeContext);

  if (!context) {
    throw new Error("useCodeMode must be used inside CodeModeProvider");
  }

  return context;
}