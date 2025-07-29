import { useEffect, useRef } from 'react';
import { useSessionContext } from '../../contexts/SessionContext';

interface PreviewPaneProps {
  setSelectedPath: (path: string | null) => void;
}

export default function PreviewPane({ setSelectedPath }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { code } = useSessionContext();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>${code.css}</style>
        </head>
        <body style="margin:0;padding:1rem;">
          <div id="root"></div>
          <script>
            const root = document.getElementById("root");
            root.innerHTML = \`${code.jsx.replace(/`/g, '\\`')}\`;

            document.querySelectorAll('*').forEach(el => {
              el.addEventListener("click", function(e) {
                const tag = e.target.tagName.toLowerCase();
                const id = e.target.id ? "#" + e.target.id : "";
                const selector = tag + id;
                parent.postMessage({ type: "ELEMENT_SELECTED", path: selector }, "*");
                e.stopPropagation();
                e.preventDefault();
              });
            });
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  }, [code]);

  // 🔁 Listen to selected element from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ELEMENT_SELECTED') {
        setSelectedPath(event.data.path);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setSelectedPath]);

  return (
    <div className="relative border rounded shadow h-96 overflow-hidden bg-white dark:bg-gray-900">
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-2 font-semibold text-sm border-b">
        Live Preview
      </div>
      <iframe
        ref={iframeRef}
        title="Component Preview"
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
