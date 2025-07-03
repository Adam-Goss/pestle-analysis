# PESTLE Environment Scanner

A professional, accessible, and minimalist web app for structured PESTLE (Political, Economic, Social, Technological, Legal, Environmental) analysis. Built for Cyber Threat Intelligence (CTI) analysts and teams to ensure rigorous, auditable, and efficient environmental scanning.

---

## Features

- **Project Management:** Create, select, and delete named PESTLE analysis projects. All data is stored locally for privacy.
- **PESTLE Workspace:** Tabbed interface for each PESTLE category. Add, edit, and delete entries with narrative, risk score, tags, and timestamps.
- **Guided Prompts:** Built-in and fully customizable prompt questions for each category to ensure comprehensive analysis and mitigate cognitive bias.
- **Summary Dashboard:** Filterable, sortable overview of all entries across categories.
- **Export:** Download your analysis as Markdown or PDF, ready for reporting or knowledge base integration.
- **Accessibility:** Fully keyboard navigable, screen reader friendly, and high-contrast.
- **Dockerized:** Easy deployment and onboarding with Docker and Docker Compose.

---

## Getting Started

### Local Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the app:**
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

### Docker

1. **Build the Docker image:**
   ```sh
   docker build -t pestle-app .
   ```
2. **Run the app in a container:**
   ```sh
   docker run -p 80:80 pestle-app
   ```
   The app will be available at [http://localhost](http://localhost).

### Docker Compose

1. **Start with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
2. **Stop the app:**
   ```sh
   docker-compose down
   ```

---

## Keyboard Shortcuts

- **Ctrl+1..6:** Switch between PESTLE tabs (Political, Economic, ...)
- **Ctrl+Enter:** Add a new entry (when not editing)
- **Ctrl+Shift+S:** Open the summary dashboard
- **Ctrl+Shift+Q:** Open the prompt panel
- **Tab/Shift+Tab:** Navigate between all interactive elements

---

## Accessibility (a11y)

- All controls are keyboard accessible with visible focus indicators
- Modals trap focus and are dismissible via Esc
- ARIA roles and labels for all major UI elements
- Sufficient color contrast for all text and controls
- Error messages are announced to screen readers

---

## Customizing Prompts

- Click "Show Prompts" in any category, then "Edit Prompts"
- Add, edit, or delete prompt questions for each PESTLE category
- Changes are saved in your browser (localStorage) and persist across sessions
- "Reset to Default" restores the original questions

---

## Exporting Your Analysis

- Use the "Export MD" or "Export PDF" buttons in the workspace header
- Markdown and PDF exports are grouped by category and include all entry details
- PDF is formatted for professional reporting

---

## Project Structure

```
pestle-app/
  src/
    components/      # React components (ProjectList, PESTLEWorkspace, etc.)
    utils/           # LocalStorage helpers
    types/           # TypeScript models
    App.tsx          # Main app layout
    index.tsx        # Entry point
  Dockerfile         # Multi-stage Docker build
  .dockerignore      # Docker context ignores
  docker-compose.yml # Docker Compose config
  README.md          # This file
```

---

## License

MIT License. See [LICENSE](../LICENSE).

---

## Contact

For questions or feedback, open an issue or contact the maintainer.
