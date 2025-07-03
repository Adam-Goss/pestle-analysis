import React, { useMemo, useState, useEffect, useRef } from 'react';
import { loadEntries } from '../utils/localStorage';

interface SummaryDashboardProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

type SortField = 'risk_factor' | 'category' | 'updated_at';

const CATEGORIES = ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'];

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ projectId, open, onClose }) => {
  const [sortField, setSortField] = useState<SortField>('risk_factor');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(CATEGORIES);
  const [tagFilter, setTagFilter] = useState('');

  const entries = loadEntries(projectId);

  const filtered = useMemo(() => {
    let list = entries.filter((e) => selectedCats.includes(e.category));
    if (tagFilter.trim()) {
      const tags = tagFilter
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      list = list.filter((e) => tags.some((t) => e.tags.map((x) => x.toLowerCase()).includes(t)));
    }
    list.sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];
      if (sortField === 'updated_at') {
        valA = Date.parse(valA as string);
        valB = Date.parse(valB as string);
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [entries, selectedCats, tagFilter, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

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
            '[data-summary-modal] button, [data-summary-modal] input, [data-summary-modal] [tabindex]:not([tabindex="-1"])',
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Summary Dashboard"
    >
      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-8 max-h-[90vh] overflow-auto border border-gray-200 dark:border-gray-800 transition-colors duration-300"
        data-summary-modal
      >
        <button
          ref={closeBtnRef}
          className="absolute top-3 right-3 text-gray-400 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full w-9 h-9 flex justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          onClick={onClose}
          aria-label="Close summary"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center tracking-tight text-gray-900 dark:text-gray-100">
          Summary Dashboard
        </h3>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedCats.includes(cat)}
                  onChange={() => toggleCat(cat)}
                  className="accent-blue-600"
                />
                {cat.substring(0, 3)}
              </label>
            ))}
          </div>
          <input
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 flex-1 min-w-[180px] focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Filter by tags (comma separated)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th
                  className="p-3 text-left cursor-pointer select-none text-gray-900 dark:text-gray-100"
                  onClick={() => toggleSort('category')}
                >
                  Category {sortField === 'category' && (sortAsc ? '▲' : '▼')}
                </th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-100">Narrative</th>
                <th
                  className="p-3 text-left cursor-pointer select-none text-gray-900 dark:text-gray-100"
                  onClick={() => toggleSort('risk_factor')}
                >
                  Risk {sortField === 'risk_factor' && (sortAsc ? '▲' : '▼')}
                </th>
                <th
                  className="p-3 text-left cursor-pointer select-none text-gray-900 dark:text-gray-100"
                  onClick={() => toggleSort('updated_at')}
                >
                  Updated {sortField === 'updated_at' && (sortAsc ? '▲' : '▼')}
                </th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-100">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.entry_id}
                  className="border-t border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                >
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-200">{e.category}</td>
                  <td className="p-3 whitespace-pre-wrap max-w-xs text-gray-800 dark:text-gray-100">
                    {e.narrative}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-200">{e.risk_factor}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">
                    {e.updated_at.slice(0, 10)}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{e.tags.join(', ')}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400 dark:text-gray-500">
                    No entries match filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
