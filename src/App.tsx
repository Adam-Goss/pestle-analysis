import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import PESTLEWorkspace from './components/PESTLEWorkspace';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const SELECTED_PROJECT_KEY = 'pestle-selected-project-id';

function getInitialDarkMode() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pestle-dark-mode');
    if (stored) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Load selected project from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_PROJECT_KEY);
    if (stored) setSelectedProjectId(stored);
  }, []);

  // Save selected project to localStorage on change
  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem(SELECTED_PROJECT_KEY, selectedProjectId);
    } else {
      localStorage.removeItem(SELECTED_PROJECT_KEY);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('pestle-dark-mode', String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      <header className="w-full py-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm mb-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
            PESTLE Environment Scanning Tool
          </span>
          <div className="flex items-center gap-4">
            <button
              className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-blue-600" />
              )}
            </button>
            <span className="text-xs text-gray-400 font-mono">v1.0</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 px-2 md:px-6">
          <aside className="md:w-80 w-full flex-shrink-0 mb-4 md:mb-0">
            <div className="h-full max-h-[700px] md:sticky md:top-8 flex flex-col">
              <ProjectList
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
              />
            </div>
          </aside>
          <section className="flex-1 w-full">
            {selectedProjectId && <PESTLEWorkspace projectId={selectedProjectId} />}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
