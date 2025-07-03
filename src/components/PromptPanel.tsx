import React, { useEffect, useRef, useState } from 'react';
import { loadPrompts, savePrompts } from '../utils/localStorage';

const DEFAULT_PROMPTS: Record<string, string[]> = {
  Political: [
    'What government policies or political events could impact the organization?',
    'Are there upcoming elections or changes in leadership?',
    'Is there political instability or unrest in the region?',
  ],
  Economic: [
    'Are there economic trends or crises that could affect operations?',
    'What is the inflation or unemployment rate?',
    'Are there supply chain or market risks?',
  ],
  Social: [
    'Are there demographic or cultural factors to consider?',
    'What social movements or trends are relevant?',
    'Are there workforce or public perception issues?',
  ],
  Technological: [
    'Are there emerging technologies that could pose risks or opportunities?',
    'Is there a risk of obsolescence or technical debt?',
    'Are there vulnerabilities in current technology stacks?',
  ],
  Legal: [
    'Are there regulatory or compliance requirements?',
    'Are there pending lawsuits or legal changes?',
    'What data privacy or intellectual property laws apply?',
  ],
  Environmental: [
    'Are there environmental risks (natural disasters, climate change)?',
    'Are there sustainability or regulatory pressures?',
    "What is the organization's environmental impact?",
  ],
};

interface PromptPanelProps {
  category: string;
  open: boolean;
  onClose: () => void;
}

const PromptPanel: React.FC<PromptPanelProps> = ({ category, open, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string[]>>({});
  const [prompts, setPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Load prompts from localStorage or fallback to defaults
  useEffect(() => {
    if (!open) return;
    const stored = loadPrompts();
    setCustomPrompts(stored);
    setPrompts(
      stored[category] && stored[category].length > 0
        ? stored[category]
        : DEFAULT_PROMPTS[category] || [],
    );
    setEditMode(false);
    setNewPrompt('');
    setEditIdx(null);
    setEditText('');
  }, [open, category]);

  // Focus trap and Esc to close
  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // Trap focus inside modal
        const focusables = Array.from(
          document.querySelectorAll(
            '[data-prompt-modal] button, [data-prompt-modal] [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => (el as HTMLElement).offsetParent !== null) as HTMLElement[];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Handlers for editing
  const handleAdd = () => {
    if (!newPrompt.trim()) return;
    setPrompts([...prompts, newPrompt.trim()]);
    setNewPrompt('');
  };
  const handleDelete = (idx: number) => {
    setPrompts(prompts.filter((_, i) => i !== idx));
  };
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditText(prompts[idx]);
  };
  const handleEditSave = () => {
    if (editIdx === null) return;
    const updated = prompts.slice();
    updated[editIdx] = editText.trim();
    setPrompts(updated);
    setEditIdx(null);
    setEditText('');
  };
  const handleEditCancel = () => {
    setEditIdx(null);
    setEditText('');
  };
  const handleSave = () => {
    const updated = { ...customPrompts, [category]: prompts };
    setCustomPrompts(updated);
    savePrompts(updated);
    setEditMode(false);
  };
  const handleReset = () => {
    setPrompts(DEFAULT_PROMPTS[category] || []);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`${category} Prompts`}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded shadow-lg max-w-md w-full p-6 relative border border-gray-200 dark:border-gray-800 transition-colors duration-300"
        data-prompt-modal
      >
        <button
          ref={closeBtnRef}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onClose}
          aria-label="Close prompts"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          {category} Prompts
        </h3>
        {!editMode ? (
          <>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-gray-800 dark:text-gray-100">
              {prompts.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
            <button
              className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-900 dark:text-gray-100"
              onClick={() => setEditMode(true)}
            >
              Edit Prompts
            </button>
          </>
        ) : (
          <>
            <ul className="pl-0 space-y-2 mb-4">
              {prompts.map((q, i) => (
                <li key={i} className="flex items-center gap-2">
                  {editIdx === i ? (
                    <>
                      <input
                        className="border border-gray-300 dark:border-gray-700 px-2 py-1 rounded text-sm flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200"
                        onClick={handleEditSave}
                      >
                        Save
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900 dark:text-gray-100">{q}</span>
                      <button
                        className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-200"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mb-4">
              <input
                className="border border-gray-300 dark:border-gray-700 px-2 py-1 rounded text-sm flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Add new prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-800 dark:text-green-200"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="text-xs px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                onClick={handleReset}
              >
                Reset to Default
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromptPanel;
