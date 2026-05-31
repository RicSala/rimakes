'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import { monokaiPro } from '@codesandbox/sandpack-themes';

type MarkdocCodeEditorProps = {
  title?: string;
};

export function MarkdocCodeEditor({
  title = 'Markdoc Sandpack demo',
}: MarkdocCodeEditorProps) {
  const serializedTitle = JSON.stringify(title);
  const files = {
    '/App.tsx': {
      code: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const title = ${serializedTitle};

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <p style={{ color: '#666', margin: 0 }}>{title}</p>
      <h1>Interactive blog block</h1>
      <button onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>
    </main>
  );
}
`,
      active: true,
    },
  };

  return (
    <div className='not-prose my-8 -mx-32'>
      <Sandpack
        theme={monokaiPro}
        template='react-ts'
        files={files}
        options={{
          layout: 'preview',
          showConsole: true,
        }}
      />
    </div>
  );
}
