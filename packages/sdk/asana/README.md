# Asana TypeScript SDK

TypeScript SDK for the Asana API, built based on the OpenAPI specification.

## Features

- 🔒 **Fully Type-Safe**: Built from Asana's OpenAPI specification
- 🚀 **Modern**: Uses `openapi-fetch` for optimal performance and bundle size
- 📝 **IntelliSense**: Rich autocomplete for all API endpoints and fields
- 🔄 **Auto-Pagination**: Built-in pagination helpers

## Installation

```bash
npm install @your-org/asana-sdk
# or
yarn add @your-org/asana-sdk
# or
bun add @your-org/asana-sdk
```

## Quick Start

```typescript
import { createAsanaSdk } from '@your-org/asana-sdk';

// Initialize the SDK
const asana = createAsanaSdk({
  token: 'your-personal-access-token',
  // baseUrl: 'https://app.asana.com/api/1.0' // optional, defaults to official API
});

// Get user information
const user = await asana.users.getUser('me');
console.log(user?.data?.name);

// List projects for a team with auto-pagination
const projects = await asana.projects.getProjectsForTeam('team-gid');
for await (const project of projects) {
  console.log(project.name);
}
```

## Authentication

The SDK supports Personal Access Tokens. You can generate one from your [Asana Developer Console](https://app.asana.com/0/developer-console).

```typescript
// Set token during initialization
const asana = createAsanaSdk({ 
  token: 'your-pat-token' 
});

// Or set/update token later
asana.setToken('your-new-token');

// Get current token
const currentToken = asana.getToken();
```

## Example Usage

```typescript
// Get a specific project with custom fields
const project = await asana.projects.getProject('project-gid', {
  fields: ['name', 'team', 'workspace', 'created_at']
});

// Get all projects in a workspace
const allProjects = await asana.projects.getProjectsForWorkspace('workspace-gid', {
  includeArchived: false,
  fields: ['name', 'team.name', 'workspace.name']
});

// Get user's team memberships
const memberships = await asana.workspaceMemberships.getWorkspaceMembershipsForUser('me');
for await (const membership of memberships) {
  console.log(`Workspace: ${membership.workspace?.name}`);
}
```

## Supported Collections

| Collection                | Status | Description                                         |
| ------------------------- | ------ | --------------------------------------------------- |
| **Projects**              | 🚧      | Get projects, project details, and project listings |
| **Teams**                 | 🚧      | Get team information and user team memberships      |
| **Users**                 | 🚧      | Get user profiles and information                   |
| **Workspace Memberships** | 🚧      | Get workspace membership details                    |
| Custom Fields             | ⏳      | Custom field management                             |
| Memberships               | ⏳      | Project and team membership management              |
| Project Memberships       | ⏳      | Project-specific membership operations              |
| Project Statuses          | ⏳      | Project status updates and management               |
| Stories                   | ⏳      | Comments and activity feed                          |
| Tasks                     | ⏳      | Task creation, updates, and management              |
| Team Memberships          | ⏳      | Team-specific membership operations                 |
| User Task Lists           | ⏳      | Personal task list management                       |
| Workspaces                | ⏳      | Workspace settings and management                   |

🚧 = Partial support (read operations only)  
⏳ = Planned for future releases
