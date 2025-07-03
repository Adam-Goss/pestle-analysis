import React, { useEffect, useState, useRef, useCallback } from "react";
import { PESTLEEntry } from "../types/models";
import { loadEntries, saveEntries } from "../utils/localStorage";
import PromptPanel from "./PromptPanel";
import SummaryDashboard from "./SummaryDashboard";
import ExportMenu from "./ExportMenu";

const CATEGORIES = [
  "Political",
  "Economic",
  "Social",
  "Technological",
  "Legal",
  "Environmental",
];

const CATEGORY_ICONS: Record<string, string> = {
  Political: "🏛️",
  Economic: "💰",
  Social: "👥",
  Technological: "💻",
  Legal: "⚖️",
  Environmental: "🌱",
};

interface PESTLEWorkspaceProps {
  projectId: string;
}

// Utility to generate a UUID (v4, simplified)
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * PESTLEWorkspace displays tabbed sections for each PESTLE category and manages entries.
 */
const PESTLEWorkspace: React.FC<PESTLEWorkspaceProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
  const [entries, setEntries] = useState<PESTLEEntry[]>(() =>
    loadEntries(projectId)
  );
  const [narrative, setNarrative] = useState("");
  const [risk, setRisk] = useState(5);
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNarrative, setEditNarrative] = useState("");
  const [editRisk, setEditRisk] = useState(5);
  const [editTags, setEditTags] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const skipSave = useRef(false);

  // Ref for narrative textarea
  const narrativeRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus narrative textarea on tab switch
  useEffect(() => {
    if (narrativeRef.current) {
      narrativeRef.current.focus();
    }
  }, [activeTab]);

  // Add new entry
  const handleAdd = useCallback(() => {
    if (!narrative.trim()) return;
    const now = new Date().toISOString();
    setEntries([
      ...entries,
      {
        entry_id: generateUUID(),
        category: activeTab,
        narrative: narrative.trim(),
        risk_factor: risk,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        created_at: now,
        updated_at: now,
      },
    ]);
    setNarrative("");
    setRisk(5);
    setTags("");
  }, [narrative, activeTab, risk, tags, entries]);

  // Keyboard shortcuts
  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+1..6: Switch tabs
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < CATEGORIES.length) {
          setActiveTab(CATEGORIES[idx]);
          e.preventDefault();
          return;
        }
      }
      // Ctrl+Enter: Add entry (if not editing)
      if (e.ctrlKey && e.key === "Enter" && !editingId) {
        handleAdd();
        e.preventDefault();
        return;
      }
      // Ctrl+Shift+S: Open summary
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        setSummaryOpen(true);
        e.preventDefault();
        return;
      }
      // Ctrl+Shift+Q: Open prompts
      if (e.ctrlKey && e.shiftKey && (e.key === "Q" || e.key === "q")) {
        setPromptOpen(true);
        e.preventDefault();
        return;
      }
    },
    [editingId, handleAdd]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // When projectId changes, load its entries and skip the next save
  useEffect(() => {
    skipSave.current = true;
    const loaded = loadEntries(projectId);
    setEntries(loaded);
    setNarrative("");
    setRisk(5);
    setTags("");
    setEditingId(null);
    setEditNarrative("");
    setEditRisk(5);
    setEditTags("");
  }, [projectId]);

  // Save entries whenever they change, but skip immediately after project switch
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    saveEntries(projectId, entries);
  }, [entries, projectId]);

  // Delete entry
  const handleDelete = (id: string) => {
    setEntries(entries.filter((e) => e.entry_id !== id));
  };

  // Start editing an entry
  const handleEdit = (entry: PESTLEEntry) => {
    setEditingId(entry.entry_id);
    setEditNarrative(entry.narrative);
    setEditRisk(entry.risk_factor);
    setEditTags(entry.tags.join(", "));
  };

  // Save edited entry
  const handleSaveEdit = (id: string) => {
    setEntries(
      entries.map((e) =>
        e.entry_id === id
          ? {
              ...e,
              narrative: editNarrative.trim(),
              risk_factor: editRisk,
              tags: editTags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
              updated_at: new Date().toISOString(),
            }
          : e
      )
    );
    setEditingId(null);
    setEditNarrative("");
    setEditRisk(5);
    setEditTags("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNarrative("");
    setEditRisk(5);
    setEditTags("");
  };

  // Filter entries by active category
  const filtered = entries.filter((e) => e.category === activeTab);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      {/* Tab Bar */}
      <div className="flex gap-2 mb-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-xl shadow-sm overflow-x-auto transition-colors duration-300">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTab === cat
                ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500 dark:text-gray-100"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-900"
            }`}
            onClick={() => setActiveTab(cat)}
          >
            <span className="mr-1" aria-hidden="true">
              {CATEGORY_ICONS[cat]}
            </span>
            {cat}
          </button>
        ))}
      </div>
      {/* Workspace Card */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-b-xl bg-white dark:bg-gray-900 p-6 min-h-[220px] shadow-sm transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {CATEGORY_ICONS[activeTab]} {activeTab} Factors
          </h2>
          <div className="flex gap-2 items-center flex-wrap">
            <button
              className="relative text-blue-600 dark:text-blue-400 text-sm px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-medium overflow-hidden group"
              onClick={() => setPromptOpen(true)}
            >
              <span role="img" aria-label="Prompts" className="mr-1">
                💡
              </span>
              <span className="relative z-10">Show Prompts</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 dark:bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </button>
            <button
              className="relative text-blue-600 dark:text-blue-400 text-sm px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-medium overflow-hidden group"
              onClick={() => setSummaryOpen(true)}
            >
              <span role="img" aria-label="Summary" className="mr-1">
                📊
              </span>
              <span className="relative z-10">Summary</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 dark:bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
            </button>
            <div className="ml-2">
              <ExportMenu projectId={projectId} />
            </div>
          </div>
        </div>
        <PromptPanel
          category={activeTab}
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
        />
        <SummaryDashboard
          projectId={projectId}
          open={summaryOpen}
          onClose={() => setSummaryOpen(false)}
        />
        <div className="mb-6 flex flex-col gap-3">
          <textarea
            ref={narrativeRef}
            className="border border-gray-300 dark:border-gray-700 rounded p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Narrative"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={3}
            aria-label="Narrative"
          />
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
              <span>Risk:</span>
              <input
                type="number"
                min={1}
                max={10}
                value={risk}
                onChange={(e) => setRisk(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-700 rounded w-16 px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </label>
            <input
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-5 py-2 rounded shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition font-semibold flex items-center gap-1"
              onClick={handleAdd}
            >
              <span role="img" aria-label="Add">
                ➕
              </span>
              Add
            </button>
          </div>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400">
              No entries yet.
            </li>
          )}
          {filtered.map((entry) => (
            <li
              key={entry.entry_id}
              className="py-2 flex items-center justify-between"
            >
              {editingId === entry.entry_id ? (
                <div className="flex-1">
                  <textarea
                    className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full mb-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={editNarrative}
                    onChange={(e) => setEditNarrative(e.target.value)}
                  />
                  <div className="flex gap-4 items-center mb-1">
                    <label className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
                      Risk:
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={editRisk}
                        onChange={(e) => setEditRisk(Number(e.target.value))}
                        className="border border-gray-300 dark:border-gray-700 rounded w-16 px-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </label>
                    <input
                      className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Tags (comma separated)"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition flex items-center gap-1"
                      onClick={() => handleSaveEdit(entry.entry_id)}
                    >
                      <span role="img" aria-label="Save">
                        💾
                      </span>
                      Save
                    </button>
                    <button
                      className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none transition flex items-center gap-1"
                      onClick={handleCancelEdit}
                    >
                      <span role="img" aria-label="Cancel">
                        ✖️
                      </span>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {entry.narrative}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Risk: {entry.risk_factor} | Tags: {entry.tags.join(", ")}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Created: {entry.created_at.slice(0, 10)} | Updated:{" "}
                    {entry.updated_at.slice(0, 10)}
                  </div>
                </div>
              )}
              {editingId === entry.entry_id ? null : (
                <div className="flex flex-col gap-1 items-end">
                  <button
                    className="text-blue-600 dark:text-blue-400 flex items-center gap-1 group"
                    onClick={() => handleEdit(entry)}
                  >
                    <span
                      role="img"
                      aria-label="Edit"
                      className="not-underline"
                    >
                      ✏️
                    </span>
                    <span className="group-hover:underline">Edit</span>
                  </button>
                  <button
                    className="text-red-500 dark:text-red-400 flex items-center gap-1 group"
                    onClick={() => handleDelete(entry.entry_id)}
                  >
                    <span
                      role="img"
                      aria-label="Delete"
                      className="not-underline"
                    >
                      🗑️
                    </span>
                    <span className="group-hover:underline">Delete</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PESTLEWorkspace;
