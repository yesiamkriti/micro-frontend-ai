import PreviewPane from '../components/session/PreviewPane';
import ChatPanel from '../components/session/ChatPanel';
import CodeTabs from '../components/session/CodeTabs';
import Sidebar from '../components/layout/Sidebar';
import { useState } from 'react';
import PropertyEditor from '../components/session/PropertyEditor';

export default function Dashboard() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] gap-4 p-4 bg-gray-50 dark:bg-gray-900">
        <PreviewPane setSelectedPath={setSelectedPath} />
        <ChatPanel />
        <CodeTabs />
        <PropertyEditor selectedPath={selectedPath} />
      </div>
    </div>
  );
}
