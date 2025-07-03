## Relevant Files

- `src/App.tsx` - Main React application entry point.
- `src/index.tsx` - ReactDOM render and app bootstrap.
- `src/components/ProjectList.tsx` - Project dashboard: create, open, rename, delete projects.
- `src/components/PESTLEWorkspace.tsx` - Main workspace with six PESTLE sections.
- `src/components/PESTLEEntryCard.tsx` - Card UI for individual PESTLE entries.
- `src/components/PromptPanel.tsx` - Collapsible panel for guided prompts.
- `src/components/SummaryDashboard.tsx` - Table/matrix view for all entries, sorting/filtering.
- `src/components/ExportMenu.tsx` - Export to Markdown and PDF.
- `src/utils/localStorage.ts` - Local storage helpers for saving/loading data.
- `src/types/models.ts` - TypeScript types for data models.
- `src/components/__tests__/` - Directory for component unit tests.
- `Dockerfile` - Docker configuration for dev environment.
- `docker-compose.yml` - (Optional) Compose file for multi-service setup.
- `tailwind.config.js` - Tailwind CSS configuration.
- `package.json` - Project dependencies and scripts.

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx`).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Set Up Development Environment
  - [ ] 1.1 Initialize React project with TypeScript template
  - [ ] 1.2 Install Tailwind CSS and configure with React
  - [ ] 1.3 Set up project structure (`src/`, `components/`, `utils/`, `types/`)
  - [ ] 1.4 Add ESLint and Prettier for code quality
  - [ ] 1.5 Initialize Git repository (if not already)

- [ ] 2.0 Implement Project Management Features
  - [ ] 2.1 Create project dashboard (list, create, open, rename, delete projects)
  - [ ] 2.2 Require unique, human-readable project names
  - [ ] 2.3 Persist project data to local storage
  - [ ] 2.4 Implement auto-save for all project data

- [ ] 3.0 Build Analysis Workspace (PESTLE Sections)
  - [ ] 3.1 Create tabbed/sectioned UI for six PESTLE categories
  - [ ] 3.2 Allow adding, editing, deleting entries in each category
  - [ ] 3.3 Display entries as cards/rows with all data fields

- [ ] 4.0 Implement Data Model and Local Storage
  - [ ] 4.1 Define TypeScript types for PESTLE entry and project
  - [ ] 4.2 Implement local storage helpers for CRUD operations
  - [ ] 4.3 Ensure timestamps (created_at, updated_at) are handled automatically

- [ ] 5.0 Create Guided Analysis Prompting System
  - [ ] 5.1 Display relevant prompt questions for each PESTLE category
  - [ ] 5.2 Implement collapsible or toggleable prompt panel
  - [ ] 5.3 Allow admin/user to add, edit, delete prompt questions

- [ ] 6.0 Develop Summary Dashboard
  - [ ] 6.1 Show all entries in a sortable/filterable table or matrix
  - [ ] 6.2 Enable sorting by risk, category, date updated
  - [ ] 6.3 Enable filtering by category and tags

- [ ] 7.0 Implement Export Functionality (Markdown & PDF)
  - [ ] 7.1 Export current project to Markdown with clear headings and tables
  - [ ] 7.2 Export current project to PDF with professional formatting

- [ ] 8.0 Apply UI/UX Design and Accessibility
  - [ ] 8.1 Use a professional, minimalist, data-centric design (Tailwind CSS)
  - [ ] 8.2 Implement keyboard shortcuts for common actions
  - [ ] 8.3 Ensure accessibility (a11y) best practices

- [ ] 9.0 Set Up Dockerized Development Environment
  - [ ] 9.1 Write Dockerfile to install Node.js, npm, and run the app
  - [ ] 9.2 (Optional) Add docker-compose.yml for multi-service orchestration
  - [ ] 9.3 Document Docker usage in README 