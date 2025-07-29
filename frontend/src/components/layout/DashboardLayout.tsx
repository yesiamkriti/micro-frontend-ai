import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import ChatPanel from '../session/ChatPanel'
import PreviewPane from '../session/PreviewPane'
import CodeTabs from '../session/CodeTabs'

export default function DashboardLayout() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectSession={setActiveSessionId} />
        <main className="flex-1 flex flex-col p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {!activeSessionId ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Select a session to begin.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-4">
                <ChatPanel sessionId={activeSessionId} />
              </div>
              <div className="flex flex-col space-y-4">
                <PreviewPane sessionId={activeSessionId} />
                <CodeTabs sessionId={activeSessionId} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
