export interface Project {
  id: string; // UUID
  name: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export type ProjectList = Project[];

export interface PESTLEEntry {
  entry_id: string; // UUID
  category: string; // PESTLE category
  narrative: string; // Markdown text
  risk_factor: number; // 1-10
  tags: string[];
  created_at: string; // ISO date
  updated_at: string; // ISO date
}
