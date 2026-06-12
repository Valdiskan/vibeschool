"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

export default function CodeEditor({
  value,
  language,
  onChange,
}: {
  value: string;
  language: "python" | "javascript";
  onChange: (v: string) => void;
}) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={tokyoNight}
      extensions={[language === "python" ? python() : javascript()]}
      height="380px"
      basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: false }}
      style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}
    />
  );
}
