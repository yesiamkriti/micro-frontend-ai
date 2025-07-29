import { useState, useEffect } from 'react';
import { useSessionContext } from '../../contexts/SessionContext';

export default function PropertyEditor({
  selectedPath,
}: {
  selectedPath: string | null;
}) {
  const { code, setCode } = useSessionContext();

  const [textContent, setTextContent] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(4);

  useEffect(() => {
    if (!selectedPath) return;

    // Simple demo: replace text and add styles scoped to the tag
    const styleRule = `
      ${selectedPath} {
        background-color: ${bgColor};
        font-size: ${fontSize}px;
        border-radius: ${borderRadius}px;
      }
    `;

    const newCss = `${code.css}\n${styleRule}`;
    const updatedJsx = code.jsx.replace(
      new RegExp(`<${selectedPath}(.*?)>(.*?)</${selectedPath}>`, 'i'),
      `<${selectedPath}$1>${textContent}</${selectedPath}>`
    );

    setCode({
      jsx: updatedJsx,
      css: newCss,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgColor, fontSize, borderRadius, textContent, selectedPath]);

  if (!selectedPath) return null;

  return (
    <div className="fixed top-20 right-4 w-64 p-4 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
      <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">
        Edit: {selectedPath}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Text</label>
          <input
            type="text"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full px-2 py-1 rounded border bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Font Size</label>
          <input
            type="range"
            min={10}
            max={48}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-8"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Border Radius</label>
          <input
            type="range"
            min={0}
            max={50}
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
