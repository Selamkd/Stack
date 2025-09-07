import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X, Sparkles } from 'lucide-react';

interface ChalkColor {
  name: string;
  color: string;
}

export const StickyNotes: React.FC = () => {
  const [noteText, setNoteText] = useState<string>(
    'Sticky Note \n\n• Fix bug\n•'
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempText, setTempText] = useState<string>(noteText);
  const [selectedColor, setSelectedColor] = useState<string>('chalk-white');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chalkColors: ChalkColor[] = [
    {
      name: 'chalk-white',
      color: '#e4e4e7',
    },
    {
      name: 'chalk-emerald',
      color: '#a7f3d099',
    },
    {
      name: 'chalk-amber',
      color: '#fde68a90',
    },
    {
      name: 'chalk-indigo',
      color: '#c7d2fe90',
    },
    {
      name: 'chalk-pink',
      color: '#fecaca90',
    },
    {
      name: 'chalk-blue',
      color: '#bfdbfe90',
    },
    {
      name: 'chalk-purple',
      color: '#e9d5ff99',
    },
  ];

  const currentChalkColor =
    chalkColors.find((c) => c.name === selectedColor) || chalkColors[0];

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempText.trim()) {
      setNoteText(tempText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempText(noteText);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setTempText(noteText);
    setIsEditing(true);
  };

  return (
    <div className="blue-glass shadow-xl border border-custom-border max-h-[350px] rounded-xl backdrop-blur-sm">
      <div className="relative rounded-2xl overflow-hidden">
        <div className="relative z-10 px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            {chalkColors.map((chalk) => (
              <button
                key={chalk.name}
                onClick={() => setSelectedColor(chalk.name)}
                className={`w-5 h-5 rounded-full transition-all ${
                  selectedColor === chalk.name
                    ? 'ring-2 ring-offset-0 ring-offset-zinc-900 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: chalk.color,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 p-4">
          <div
            className="min-h-[200px] shadow-lg p-4 rounded"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(1px)',
              boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {isEditing ? (
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  className="w-full min-h-[160px] bg-transparent border-none outline-none resize-none"
                  style={{
                    color: currentChalkColor.color,

                    fontFamily: "'Comic Neue', cursive",
                    fontSize: '15px',
                    lineHeight: '1.6',
                  }}
                  placeholder="Write your thoughts..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-lime-200/10 hover:bg-lime-200/20 text-lime-200 rounded text-sm transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="whitespace-pre-wrap break-words cursor-pointer"
                onClick={handleStartEdit}
                style={{
                  color: currentChalkColor.color,

                  fontFamily: "'Comic Neue', cursive",
                  fontSize: '18px',
                  lineHeight: '1.6',
                  minHeight: '250px',
                }}
              >
                {noteText || 'Click to add a note...'}
              </div>
            )}
          </div>
        </div>
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};

export default StickyNotes;
