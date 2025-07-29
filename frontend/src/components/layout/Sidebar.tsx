import { useEffect, useState } from 'react';
import axios from '../../utils/api';
import { useSessionContext } from '../../contexts/SessionContext';

type Session = {
  _id: string;
  sessionName: string;
};

export default function Sidebar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { sessionId, setSessionId, setChat, setCode } = useSessionContext();
  const token = localStorage.getItem('token');

  const fetchSessions = async () => {
    const res = await axios.get('/sessions', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSessions(res.data);
  };

  const loadSession = async (id: string) => {
    const res = await axios.get(`/sessions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSessionId(id);
    setChat(res.data.chatHistory);
    setCode(res.data.componentCode);
  };

  const createNewSession = async () => {
    const res = await axios.post(
      '/sessions',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchSessions();
    await loadSession(res.data._id);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4 border-r dark:border-gray-700 overflow-y-auto flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Your Sessions</h2>

      <button
        onClick={createNewSession}
        className="mb-4 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 text-sm"
      >
        ➕ New Session
      </button>

      <ul className="space-y-2">
        {sessions.map((s) => (
          <li key={s._id}>
            <button
              onClick={() => loadSession(s._id)}
              className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-indigo-100 dark:hover:bg-indigo-700 dark:text-white ${
                sessionId === s._id
                  ? 'bg-indigo-200 dark:bg-indigo-600 font-medium'
                  : ''
              }`}
            >
              {s.sessionName || 'Untitled'}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
