import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import type { ReactNode } from 'react';
import axios from '../utils/api'

type Code = {
  jsx: string
  css: string
}

type Message = {
  role: 'user' | 'ai'
  message: string
}

type SessionContextType = {
  sessionId: string | null
  setSessionId: (id: string) => void
  chat: Message[]
  setChat: (chat: Message[]) => void
  code: Code
  setCode: (code: Code) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chat, setChat] = useState<Message[]>([])
  const [code, setCode] = useState<Code>({ jsx: '', css: '' })
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) return
      const res = await axios.get(`/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setChat(res.data.chatHistory)
      setCode(res.data.componentCode)
    }

    fetchSessionData()
  }, [sessionId])

  return (
    <SessionContext.Provider
      value={{ sessionId, setSessionId, chat, setChat, code, setCode }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSessionContext = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessionContext must be inside SessionProvider')
  return ctx
}
