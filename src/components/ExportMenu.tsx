import React from "react";
import { loadEntries, loadProjects } from "../utils/localStorage";
import { PESTLEEntry, Project } from "../types/models";
import MarkdownIt from "markdown-it";
import autoTable from "jspdf-autotable";

interface ExportMenuProps {
  projectId: string;
}

const CATEGORIES = [
  "Political",
  "Economic",
  "Social",
  "Technological",
  "Legal",
  "Environmental",
];

function generateMarkdown(project: Project, entries: PESTLEEntry[]): string {
  let md = `# PESTLE Analysis: ${project.name}\n\n`;
  CATEGORIES.forEach((cat) => {
    md += `## ${cat}\n\n`;
    const catEntries = entries.filter((e) => e.category === cat);
    if (catEntries.length === 0) {
      md += "_No entries_\n\n";
      return;
    }
    md += "| Narrative | Risk | Tags | Updated |\n";
    md += "| --- | --- | --- | --- |\n";
    catEntries.forEach((e) => {
      const tags = e.tags.length > 0 ? e.tags.join(", ") : "-";
      md += `| ${e.narrative.replaceAll("\n", " ")} | ${e.risk_factor} | ${tags} | ${e.updated_at.slice(0, 10)} |\n`;
    });
    md += "\n";
  });
  return md;
}

async function exportPDF(markdown: string, filename: string) {
  const jsPDFModule = await import("jspdf");
  const JsPDF = jsPDFModule.default;
  const doc = new JsPDF();
  const md = new MarkdownIt();

  // Split markdown into sections by category
  const sections = markdown.split(
    /## (Political|Economic|Social|Technological|Legal|Environmental)/g
  );
  // sections[0] is the title, then [cat, content, cat, content, ...]
  let y = 10;

  // Render the title
  const titleMatch = markdown.match(/^# (.+)/);
  if (titleMatch) {
    doc.setFontSize(18);
    doc.text(titleMatch[1], 10, y);
    y += 10;
  }

  for (let i = 1; i < sections.length; i += 2) {
    const cat = sections[i];
    const content = sections[i + 1] || "";
    // Render category heading
    doc.setFontSize(14);
    doc.text(cat, 10, y);
    y += 8;
    // Find table in content
    const tableMatch = content.match(
      /\| Narrative \| Risk \| Tags \| Updated \|[\s\S]*?(?=\n\n|$)/
    );
    if (tableMatch) {
      // Parse table rows
      const lines = tableMatch[0].trim().split("\n");
      const headers = lines[0]
        .split("|")
        .map((h) => h.trim())
        .filter(Boolean);
      const rows = lines.slice(2).map((row) =>
        row
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
      );
      if (rows.length > 0) {
        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: y,
          theme: "grid",
          headStyles: { fillColor: [37, 99, 235] },
          styles: { fontSize: 10 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;
      } else {
        doc.setFontSize(10);
        doc.text("No entries", 12, y);
        y += 8;
      }
    } else {
      // Render "No entries" or other text
      const html = md.render(content);
      // Simple text fallback
      doc.setFontSize(10);
      doc.text(html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"), 12, y);
      y += 8;
    }
  }
  doc.save(`${filename}.pdf`);
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
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
    <div className="flex gap-3 items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 shadow-sm transition-colors duration-300">
      <button
        className="px-3 py-1 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        onClick={handleMarkdown}
        aria-label="Export as Markdown"
      >
        <span className="inline-block align-middle">Export MD</span>
      </button>
      <button
        className="px-3 py-1 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        onClick={handlePDF}
        aria-label="Export as PDF"
      >
        <span className="inline-block align-middle">Export PDF</span>
      </button>
    </div>
  );
};

export default ExportMenu;
