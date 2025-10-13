# 👁️ Arcana

**AI-powered insights for your productivity tools**

Arcana is a conversational AI assistant that connects to your work tools, starting with Asana. Chat naturally with your data to get instant insights, visualizations, and trends from your projects and tasks.

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/a-rebets/arcana?utm_source=oss&utm_medium=github&utm_campaign=a-rebets%2Farcana&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## 🛠 Tech Stack

- **Frontend**: React + Vite + TailwindCSS + React Router v7 (Framework mode)
- **Backend**: Convex (database, API, real-time)
- **Authentication**: Convex Auth + Resend
- **AI**: Convex Agents + Vercel AI SDK, models served by OpenRouter
- **Data Fetching**: TanStack Query
- **Runtime**: Bun

## 📁 Workspace Structure

This project uses [Bun workspaces](https://bun.com/docs/install/workspaces) to organize code into modular packages:

```
packages/
├── web/          # Main web application (React + Convex)
├── tools/        # AI SDK tool packages
│   └── asana/
├── sdk/          # Core SDK packages
│   └── asana/
└── doc-gen/      # Asana API documentation generator
```

This modular structure allows for clean separation of concerns and makes it easy to add new tool integrations as independent packages.

## 🔧 Environment Variables

### Frontend Environment Variables

Create a `.env` file in the `packages/web/` directory with:

```bash
# Convex URLs (replace with your deployment URLs)
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEX_API_URL=https://your-deployment.convex.site
```

### Backend Environment Variables

Set these with `npx convex env set VARIABLE value` in the `packages/web/` directory:

```bash
# Asana OAuth (see setup instructions below)
ASANA_CLIENT_ID=your_asana_client_id
ASANA_CLIENT_SECRET=your_asana_client_secret

# AI Models (https://openrouter.ai/)
OPENROUTER_API_KEY=your_openrouter_api_key

# Resend, email service (https://resend.com/)
AUTH_RESEND_KEY=your_resend_api_key
```

## 🚀 Quick Start

1. **Clone and install dependencies:**
```bash
bun install
```

2. **Set up Convex Auth:**
```bash
cd packages/web

# For development
bunx @convex-dev/auth

# For production deployment
bunx @convex-dev/auth --prod
```

3. **Configure environment variables** (see Environment Variables section above)

4. **Set up Asana integration:**
   - [Create a new application](https://developers.asana.com/docs/oauth#register-an-application)
   - Set the redirect URI to your Convex deployment URL + `/oauth/callback`
   - Copy the Client ID and Client Secret to your environment variables

5. **Start development server:**
```bash
bun dev
```

## 🔗 Integrations

- ✅ **Asana** - Full OAuth integration for projects and tasks
- 🚧 **Google Calendar** - Coming soon
- 🚧 **Notion** - Coming soon
- 🚧 **More tools** - Planned

## Licensing

Arcana is licensed under the AGPLv3.  
- ✅ You’re free to fork, modify, and self-host your own version.  
- ✅ Contributions are welcome.  
- ❌ Commercial SaaS use without releasing your modifications is not allowed.  
If you’re a company interested in using Arcana commercially, reach out for licensing.
