import React from 'react';
import { loadEntries, loadProjects } from '../utils/localStorage';
import { PESTLEEntry, Project } from '../types/models';

interface ExportMenuProps {
  projectId: string;
}

const CATEGORIES = ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'];

function generateMarkdown(project: Project, entries: PESTLEEntry[]): string {
  let md = `# PESTLE Analysis: ${project.name}\n\n`;
  CATEGORIES.forEach((cat) => {
    md += `## ${cat}\n\n`;
    const catEntries = entries.filter((e) => e.category === cat);
    if (catEntries.length === 0) {
      md += '_No entries_\n\n';
      return;
    }
    md += '| Narrative | Risk | Tags | Updated |\n';
    md += '| --- | --- | --- | --- |\n';
    catEntries.forEach((e) => {
      md += `| ${e.narrative.replaceAll('\n', ' ')} | ${e.risk_factor} | ${e.tags.join(', ')} | ${e.updated_at.slice(0, 10)} |\n`;
    });
    md += '\n';
  });
  return md;
}

async function exportPDF(markdown: string, filename: string) {
  const jsPDFModule = await import('jspdf');
  const JsPDF = jsPDFModule.default;
  const doc = new JsPDF();
  const lines = doc.splitTextToSize(markdown, 180);
  doc.text(Array.isArray(lines) ? lines : [String(lines)], 10, 10);
  doc.save(`${filename}.pdf`);
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const ExportMenu: React.FC<ExportMenuProps> = ({ projectId }) => {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const entries = loadEntries(projectId);

  const handleMarkdown = () => {
    const md = generateMarkdown(project, entries);
    downloadFile(md, `${project.name}.md`);
  };

  const handlePDF = async () => {
    const md = generateMarkdown(project, entries);
    await exportPDF(md, project.name);
  };

  return (
    <div className="flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      <button
        className="px-3 py-1 rounded-md text-sm font-medium bg-white border border-gray-300 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        onClick={handleMarkdown}
        aria-label="Export as Markdown"
      >
        <span className="inline-block align-middle">Export MD</span>
      </button>
      <button
        className="px-3 py-1 rounded-md text-sm font-medium bg-white border border-gray-300 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        onClick={handlePDF}
        aria-label="Export as PDF"
      >
        <span className="inline-block align-middle">Export PDF</span>
      </button>
    </div>
  );
};

export default ExportMenu;
