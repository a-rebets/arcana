# Asana TypeScript SDK

TypeScript SDK for the Asana API, built based on the OpenAPI specification.

## Features

- 🔒 **Fully Type-Safe**: Built from Asana's OpenAPI specification
- 🚀 **Modern**: Uses `openapi-fetch` for optimal performance and bundle size
- 📝 **IntelliSense**: Rich autocomplete for all API endpoints and fields
- 🔄 **Auto-Pagination**: Built-in pagination helpers

## Installation

```bash
npm install asana-sdk
# or
yarn add asana-sdk
# or
bun add asana-sdk
```

## Quick Start

```typescript
import { createAsanaSdk } from 'asana-sdk';

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

## Working with opt_fields (type-safe expansions)

Asana returns compact objects by default. Optional properties (like `team`, `workspace`, `members`) are only present when requested via `opt_fields`.

This SDK provides utilities to assert those fields are present after you request them, without redefining types:

- `WithRequired<T, K>`: Type utility to make `K` keys required in `T`.
- `castWithOptFields<T, K>(value)` and `castArrayWithOptFields<T, K>(arr)`: Runtime no-ops that instruct TypeScript that you actually requested `K` with `opt_fields`, so those keys are present at runtime.

Examples

```ts
import { WithRequired, castArrayWithOptFields, type ProjectResponse } from 'asana-sdk';

type ProjectWithTeamAndWorkspace = WithRequired<ProjectResponse, 'team' | 'workspace'>;

// List projects in a team with required team/workspace present
const projects: Array<ProjectWithTeamAndWorkspace> = castArrayWithOptFields<ProjectResponse, 'team' | 'workspace'>(
  await asana.projects.getProjectsForTeam(teamGid, {
    fields: ['name', 'team', 'team.name', 'workspace', 'workspace.name'],
  }),
);

// Team memberships: require team presence
import { castArrayWithOptFields, type TeamMembershipCompact, type WithRequired } from 'asana-sdk';
type TeamMembershipWithTeam = WithRequired<TeamMembershipCompact, 'team'>;

const teamMemberships: Array<TeamMembershipWithTeam> = castArrayWithOptFields<TeamMembershipCompact, 'team'>(
  await asana.teamMemberships.getTeamMembershipsForUser('me', workspaceGid, {
    fields: ['team', 'team.name'],
  }),
);
```

Notes
- Always include the fields you plan to access in `fields` (mapped to Asana `opt_fields`).
- Prefer `ProjectResponse` for project lists when you need richer fields; otherwise `ProjectCompact` is fine.
- These casts are runtime no-ops; they only help TypeScript understand your `opt_fields` contract.

## Supported Collections

Legend: ✅ Supported • ⏳ Planned

| Collection            | GET | POST | PUT | DELETE |
| --------------------- | --- | ---- | --- | ------ |
| Workspaces            | ✅   | ⏳    | ⏳   | ⏳      |
| Workspace memberships | ✅   | ⏳    | ⏳   | ⏳      |
| Projects              | ✅   | ⏳    | ⏳   | ⏳      |
| Team memberships      | ✅   | ⏳    | ⏳   | ⏳      |
| Teams                 | ✅   | ⏳    | ⏳   | ⏳      |
| Users                 | ✅   | ⏳    | ⏳   | ⏳      |
| Allocations           | ⏳   | ⏳    | ⏳   | ⏳      |
| Attachments           | ⏳   | ⏳    | ⏳   | ⏳      |
| Events                | ⏳   | ⏳    | ⏳   | ⏳      |
| Goal relationships    | ⏳   | ⏳    | ⏳   | ⏳      |
| Goals                 | ⏳   | ⏳    | ⏳   | ⏳      |
| Jobs                  | ⏳   | ⏳    | ⏳   | ⏳      |
| Memberships           | ✅   | ⏳    | ⏳   | ⏳      |
| Portfolios            | ⏳   | ⏳    | ⏳   | ⏳      |
| Project briefs        | ⏳   | ⏳    | ⏳   | ⏳      |
| Project statuses      | ⏳   | ⏳    | ⏳   | ⏳      |
| Reactions             | ⏳   | ⏳    | ⏳   | ⏳      |
| Sections              | ✅   | ⏳    | ⏳   | ⏳      |
| Status updates        | ⏳   | ⏳    | ⏳   | ⏳      |
| Tags                  | ✅   | ⏳    | ⏳   | ⏳      |
| Tasks                 | ✅   | ⏳    | ⏳   | ⏳      |
| Time tracking entries | ⏳   | ⏳    | ⏳   | ⏳      |
| User task lists       | ✅   | ⏳    | ⏳   | ⏳      |
