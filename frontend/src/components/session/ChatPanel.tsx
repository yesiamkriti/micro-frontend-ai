import { useState } from 'react'
import axios from '../../utils/api'
import { useSessionContext } from '../../contexts/SessionContext'

export default function ChatPanel() {
  const { sessionId, chat, setChat, setCode } = useSessionContext()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return

    const updatedChat = [...chat, { role: 'user' as 'user', message: input }]
    setChat(updatedChat)
    setLoading(true)

    try {
      const res = await axios.post(
        '/ai/generate',
        { prompt: input, sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChat(res.data.chatHistory)
      setCode(res.data.componentCode)
      setInput('')
    } catch (err) {
      console.error('AI generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border rounded-lg p-4 shadow">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-black dark:text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
            }`}
          >
            {msg.message}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded bg-yellow-100 dark:bg-yellow-900 text-sm animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe your UI..."
          className="flex-1 px-4 py-2 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}
