import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import JSZip from 'jszip'
import saveAs from 'file-saver'
import { useSessionContext } from '../../contexts/SessionContext'

export default function CodeTabs() {
  const [activeTab, setActiveTab] = useState<'jsx' | 'css'>('jsx')
  const { code } = useSessionContext()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeTab === 'jsx' ? code.jsx : code.css)
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    zip.file('Component.tsx', code.jsx)
    zip.file('styles.css', code.css)
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'component.zip')
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded border shadow">
      <div className="flex justify-between items-center border-b dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('jsx')}
            className={`px-3 py-1 rounded ${
              activeTab === 'jsx'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            JSX
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1 rounded ${
              activeTab === 'css'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            CSS
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="text-sm text-indigo-600 hover:underline"
          >
            Copy
          </button>
          <button
            onClick={downloadZip}
            className="text-sm text-indigo-600 hover:underline"
          >
            Download ZIP
          </button>
        </div>
      </div>

      <div className="p-4 overflow-auto max-h-80">
        <SyntaxHighlighter
          language={activeTab}
          style={materialDark}
          wrapLongLines
          customStyle={{ fontSize: '0.85rem', borderRadius: '0.5rem' }}
        >
          {activeTab === 'jsx' ? code.jsx : code.css}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
