import React, { useEffect, useState } from 'react';
import { Project } from '../types/models';
import { loadProjects, saveProjects } from '../utils/localStorage';

interface ProjectListProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
}

// Utility to generate a UUID (v4, simplified)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * ProjectList component displays and manages the list of PESTLE projects.
 */
const ProjectList: React.FC<ProjectListProps> = ({ selectedProjectId, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  // Load projects from localStorage on mount
  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  // Auto-save projects to localStorage on change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjects(projects);
    }
  }, [projects]);

  // Handle project creation
  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError('Project name required');
      return;
    }
    if (projects.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Project name must be unique');
      return;
    }
    const now = new Date().toISOString();
    const newProject = { id: generateUUID(), name: trimmed, createdAt: now, updatedAt: now };
    setProjects([...projects, newProject]);
    setNewName('');
    setError('');
    onSelectProject(newProject.id);
  };

  // Handle project deletion
  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    if (selectedProjectId === id) onSelectProject('');
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center tracking-tight text-gray-900 dark:text-gray-100">
        PESTLE Projects
      </h1>
      <div className="flex gap-2 mb-4">
        <label htmlFor="project-name-input" className="sr-only">
          Project name
        </label>
        <input
          id="project-name-input"
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="New project name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          aria-label="New project name"
        />
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition font-semibold"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
      {error && (
        <div
          className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-700 rounded px-3 py-2 mb-3 text-sm text-center"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {projects.map((project) => (
          <li
            key={project.id}
            className={`flex items-center justify-between py-3 px-2 rounded-lg mb-1 transition-colors duration-200 cursor-pointer select-none ${
              selectedProjectId === project.id
                ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <button
              className="flex-1 text-left font-medium text-gray-800 dark:text-gray-100 cursor-pointer bg-transparent border-0 p-0 m-0 outline-none focus:underline focus:text-blue-700 dark:focus:text-blue-300 transition"
              style={{ background: 'none' }}
              onClick={() => onSelectProject(project.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectProject(project.id);
                }
              }}
              tabIndex={0}
              aria-pressed={selectedProjectId === project.id}
            >
              {project.name}
            </button>
            <button
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline ml-3 px-2 py-1 rounded focus:ring-2 focus:ring-red-300 focus:outline-none transition"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(project.id);
              }}
              aria-label={`Delete project ${project.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
