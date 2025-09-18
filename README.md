# 👁️ Arcana

**AI-powered insights for your productivity tools**

Arcana is a conversational AI assistant that connects to your work tools, starting with Asana. Chat naturally with your data to get instant insights, visualizations, and trends from your projects and tasks.

## 🛠 Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Convex (database, API, real-time)
- **Authentication**: Convex Auth + Resend
- **AI**: Vercel AI SDK with models served by OpenRouter
- **Data Fetching**: TanStack Query
- **Runtime**: Bun

## 📁 Workspace Structure

This project uses [Bun workspaces](https://bun.com/docs/install/workspaces) to organize code into modular packages:

```
packages/
├── web/          # Main web application (arcana-web)
└── tools/        # Integration packages for external tools
    ├── asana/    # Asana integration
    └── ...       # More tools / integrations
```

This modular structure allows for clean separation of concerns and makes it easy to add new tool integrations as independent packages.

## 🔧 Environment Variables

To deploy this app, you'll need the following environment variables:

```bash
# Convex
CONVEX_SITE_URL=https://your-convex-deployment.convex.site

# Asana OAuth
ASANA_CLIENT_ID=your_asana_client_id
ASANA_CLIENT_SECRET=your_asana_client_secret

# AI Models (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key

# Email (Resend)
AUTH_RESEND_KEY=your_resend_api_key
```

## 🚀 Quick Start

Install dependencies:
```bash
bun install
```

Start development server:
```bash
bun dev
```

Build for production:
```bash
bun start
```

## 🔗 Integrations

- ✅ **Asana** - Full OAuth integration for projects and tasks
- 🚧 **Google Calendar** - Coming soon
- 🚧 **Notion** - Coming soon
- 🚧 **More tools** - Planned
- 

## Licensing

Arcana is licensed under the AGPLv3.  
- ✅ You’re free to fork, modify, and self-host your own version.  
- ✅ Contributions are welcome.  
- ❌ Commercial SaaS use without releasing your modifications is not allowed.  
If you’re a company interested in using Arcana commercially, reach out for licensing.
