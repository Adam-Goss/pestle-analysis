import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import PESTLEWorkspace from './components/PESTLEWorkspace';

const SELECTED_PROJECT_KEY = 'pestle-selected-project-id';

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <header className="w-full py-4 bg-white border-b border-gray-200 shadow-sm mb-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-blue-700">
            PESTLE Environment Scanning Tool
          </span>
          <span className="text-xs text-gray-400 font-mono">v1.0</span>
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
