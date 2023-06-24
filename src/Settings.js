import CodeEditor from '@uiw/react-textarea-code-editor';
import React, { useState } from 'react'
import useSWR from 'swr'

export function Settings() {
  const [code, setCode] = useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
  const { data, error, isLoading } = useSWR('http://localhost:3000/api/settings')
 
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      onChange={(evn) => setCode(evn.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
  );
}