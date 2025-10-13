# Arcana: chat with your productivity tools

Arcana is an AI-powered application that integrates with productivity platforms, starting with Asana. Our goal is to build high-quality, type-safe tools that allow LLM models to seamlessly interact with productivity applications, providing users with natural language access to their work data and insights.

This document explains how to navigate the project and provides development guidelines for agents working on the Arcana app.


## Development Scripts

The workspace provides several scripts for development and maintenance:

### Available Scripts

- **`bun run lint`** - Run Biome linter and package-specific linters
  - Checks code quality and type safety across the workspace
  - Also regenerates React Router types when routes change

- **`bun run format`** - Format code with Biome
  - Auto-formats all TypeScript/JavaScript files according to project style

- **`bun run clean`** - Reset workspace state
  - Removes all `dist/` and `node_modules/` directories
  - Useful when dependency issues occur or before fresh install

All commands should be run from the root of the workspace unless you need commands specific to a package.

### Shared Dependencies (Catalog)

When a dependency is needed by multiple packages, instead of manually running `bun add` in each package directory, use the **catalog** pattern:

1. Check the latest version: `bun info <package>`
2. Add it to the root `package.json` catalog (see below)
3. Reference it in each package that needs it
4. Run `bun i` from the workspace root

Managed common dependencies via the **catalog** pattern:

1. **Add to root `package.json` catalog:**
```json
{
  "catalog": {
    "@biomejs/biome": "2.2.6",
    "typescript": "5.9.2",
    "zod": "4.1.12"
  }
}
```

2. **Reference in package `dependencies` or `devDependencies`:**
```json
{
  "dependencies": {
    "zod": "catalog:"
  },
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

This ensures version consistency across all packages that use the same dependency.


## Package Architecture & Dependencies

The Arcana project uses a modular architecture with three interconnected packages that work together to provide AI-powered Asana integration:

### Package Relationships

```
packages/web/ (Main Application)
    ↓ depends on
packages/tools/asana/ (AI SDK Tools)
    ↓ depends on  
packages/sdk/asana/ (Core SDK)
```

#### 1. **packages/sdk/asana/** - Core SDK
- **Purpose**: Low-level Asana API client with full type safety
- **Exports**: HTTP client, type definitions, resource methods
- **Key Files**: 
  - `src/index.ts` - Main SDK exports and resource wiring
  - `src/core/client.ts` - OpenAPI HTTP client and auth middleware
  - `src/core/type-utilities.ts` - `OptFields`, expanded shape helpers
  - `src/resources/*.ts` - Resource creators (e.g. `createWorkspaces`)
  - `src/lib/api.d.ts` - Generated OpenAPI types (do not edit)

#### 2. **packages/tools/asana** - AI SDK Tools
- **Purpose**: High-level AI tools that wrap the SDK for conversational AI
- **Exports**: Tool definitions with Zod schemas for AI SDK
- **Dependencies**: `asana-sdk`
- **Key Files**:
  - `src/http.ts` - SDK client factory with token
  - `src/schemas.ts` - Zod validation schemas
  - `src/listUserProjects.ts` - example tool

#### 3. **packages/web/** - Main Application
- **Purpose**: React app with Convex backend
- **Dependencies**: `asana-tools`
- **Key Files**:
  - `convex/ai/chat.ts` - chat endpoint for SSE streaming
  - `convex/core/*` - general Convex functions for the app
  - `convex/asana/oauth/*` - OAuth token management
  - `convex/http.ts` - HTTP router registration
  - `convex/lib/env.ts` - Environment configuration

### Data Flow

1. **Authentication**: OAuth tokens are stored in Convex and passed via `experimental_context`
2. **Tool Execution**: AI calls tools → tools use SDK → SDK makes HTTP requests to Asana
3. **Multi-step Processing**: Convex handler orchestrates multiple tool calls using `stopWhen`
4. **Response Streaming**: Results are streamed back to the frontend via AI SDK's streaming

### Token Management

```typescript
// In convex/chat.ts
const connection = await ctx.runQuery(internal.asana.oauth.protected.getConnection, {});
const result = streamText({
  // ...
  experimental_context: {
    asanaToken: connection?.accessToken, // Token flows down to tools
  },
});

// In tools/asana/src/listUserProjects.ts
execute: async (input, opts) => {
  const ctx = opts.experimental_context as { asanaToken?: string };
  const token = ctx.asanaToken; // Token extracted and passed to SDK
  return listUserProjects(input, { token });
}
```


## Frontend Architecture (React Router v7 Framework Mode)

Arcana uses React Router v7 in Framework mode, which provides file-based routing with type safety and server-side rendering capabilities.

### Route Configuration

Routes are defined in `packages/web/src/routes.ts` using a nested layout structure:

- **Public routes** (`/welcome`) - wrapped in `layouts/nav/public.tsx` to redirect authenticated users
- **Protected routes** - wrapped in `layouts/nav/protected.tsx` to require authentication
- **Catch-all route** (`*`) - handles 404s without auth requirements

The configuration uses `layout()` and `route()` functions from `@react-router/dev/routes` to create a type-safe route tree.

### Layout System

The app uses nested layouts for authentication and onboarding guards:

- **`layouts/nav/public.tsx`** - Redirects authenticated users away from public pages
- **`layouts/nav/protected.tsx`** - Requires authentication, redirects to `/welcome` if not authenticated
- **`layouts/nav/onboarded.tsx`** - Requires completed onboarding, redirects to `/onboarding` if not done
- **`layouts/nav/not-onboarded.tsx`** - Redirects completed users away from onboarding

### Route Modules

Each route file can export:

```typescript
import type { Route } from "./+types/index";

// Optional: Load data for the route
export async function loader({ params }: Route.LoaderArgs) {
  return { data: "value" };
}

// Optional: Handle form submissions
export async function action({ request }: Route.ActionArgs) {
  // Handle POST/PUT/DELETE
}

// Optional: Add metadata (body classes, etc.)
export const handle = {
  bodyClasses: "grid place-items-center min-h-screen",
};

// Required: The component
export default function Component({ 
  loaderData, 
  params 
}: Route.ComponentProps) {
  return <div>{loaderData.data}</div>;
}
```

### Type Safety

React Router generates types automatically:
- Import `Route` from `"./+types/<routeName>"` in each route file
- Get typed `params`, `loaderData`, `actionData` based on your route configuration
- Types are regenerated when you change `routes.ts` and run `bun run lint` or `bun run dev`

### Working with Routes

1. **Adding a new route**: Add to `routes.ts` and create the corresponding file
2. **Adding auth guards**: Wrap routes in appropriate layout components
3. **Route-specific styles**: Use `handle.bodyClasses` and access via `useMatches()` in root layout
4. **Dynamic segments**: Use `:paramName` in route paths, access via `params.paramName`


## Asana SDK Documentation Structure

The documentation is located in `docs/asana-api/` and organized by API resources:

- Each resource has its own directory (e.g., `tasks/`, `projects/`, `users/`)
- Each resource directory contains an `about.md` file with the resource overview
- Endpoints are organized by HTTP method in subdirectories (`get/`, `post/`, `put/`, `delete/`)

### Resource Overviews
- **Location**: `docs/asana-api/{resource}/about.md`
- **Content**: General description, concepts, and use cases for each API resource
- **Example**: `docs/asana-api/tasks/about.md` explains what tasks are and how they work

### Individual Endpoints
- **Location**: `docs/asana-api/{resource}/{method}/{operationId}.md`
- **Content**: Complete API documentation including parameters, responses, and Node.js examples
- **Example**: `docs/asana-api/tasks/post/createTask.md` for creating tasks

### Error Documentation
- **Location**: `docs/asana-api/errors.md`
- **Content**: Consolidated error responses (400, 401, 403, 404, 500) with descriptions and examples
- **Usage**: Referenced by `<reference>` tags in endpoint files


## AI SDK Documentation

Additional documentation for AI SDK patterns and best practices:

- **Location**: `docs/ai-sdk/`
- **Content**: AI SDK implementation guides and patterns
- **Key Files**:
  - `tool-calling.md` - Tool calling patterns and examples
  - `ui-tool-usage.md` - UI patterns for tool usage display


## Convex Agents SDK Documentation

Additional documentation for Convex Agents:

- **Location**: `docs/convex-sdk/`
- **Content**: Convex Agents implementation guides and patterns
- **Key Files**:
  - `agent-usage.md` - Agent usage patterns and examples
  - `messages.md` - Messages patterns and examples
  - `threads.md` - Threads patterns and examples


## Development Guidelines

When expanding and implementing the platform, follow these principles. SDK guidelines below are Asana-specific. Tool guidelines are general and apply to any integration (Asana, Calendar, Notion, etc.).

### Asana SDK Guidelines

### 1. **Use Generated Types from OpenAPI**
- Always import types from `../lib/api` (generated from OpenAPI spec)
- Don't manually define types that already exist in the generated schema
- Use `components["schemas"]["TypeName"]` for schema types

```typescript
// ✅ Correct - Use generated types
export type WorkspaceCompact = components["schemas"]["WorkspaceCompact"];

// ❌ Wrong - Don't redefine existing types
export type WorkspaceCompact = { gid: string; name: string; };
```

### Verifying Types and Operations

If you're unsure about a particular endpoint, parameters, or response shape, it's safe to grep the generated types:

- File: `packages/sdk/asana/src/lib/api.d.ts` (do not edit)
- This file mirrors the OpenAPI source and defines:

```ts
export interface paths { /* ... */ }
export interface components {
  schemas: { /* ... */ };
  responses: { /* ... */ };
  parameters: { /* ... */ };
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export interface operations {
  operation: {
    parameters: {
      query?: { /* ... */ };
      header?: never;
      path: { /* ... */ };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: { headers: { [name: string]: unknown }; content: { "application/json": {} } };
      400: components["responses"]["BadRequest"];
      401: components["responses"]["Unauthorized"];
      403: components["responses"]["Forbidden"];
      404: components["responses"]["NotFound"];
      500: components["responses"]["InternalServerError"];
    };
  };
}
```

Use this as the source of truth for valid `opt_fields`, path parameters, and response envelopes.

### Asana Request Options (opt_fields, opt_pretty)

- GET: pass options as query params, e.g. `?opt_fields=followers,assignee&opt_pretty=true`.
- POST/PUT: if `application/json`, use a top-level `options` object; if `application/x-www-form-urlencoded`, use `opt_`-prefixed params.
- `opt_fields` selects exact fields; `gid` is always included. `opt_pretty` is for debugging only.
- In the SDK, use `OptFields<"operationName">` to type-safely specify valid fields.

### Response Shapes: Compact vs Full and opt_fields Expansion

- Asana schemas distinguish between compact and fuller shapes:
  - `ProjectCompact`: minimal fields for efficiency
  - `ProjectBase`: extends `ProjectCompact` with standard fields
  - `ProjectResponse`: extends `ProjectBase` with additional properties (e.g. expanded arrays)
- Endpoint defaults vary:
  - Many GET list endpoints (e.g. `getProjectsForTeam`) return arrays of compact objects by default
  - Create/PUT endpoints (e.g. `createProjectForTeam`) often return a fuller `ProjectResponse`
- `opt_fields` extends the returned object by including optional fields and expanded nested objects; `gid` is always present
- Where to verify:
  - Check `components["schemas"]["ProjectCompact" | "ProjectBase" | "ProjectResponse"]` in `api.d.ts`
  - Check the specific operation in `operations` for the default response envelope and available `parameters.query.opt_fields`
- In the SDK:
  - Use `OptFields<"operationName">` to request valid fields
  - When you've requested expansions for arrays, use `castArrayWithOptFields<T, K>` to safely access expanded properties


### 2. **Resource Creator Pattern**
- Implement resources via `create{Resource}(client)` factory functions that return plain-method objects (no classes). Use consistent verbs: `get{Resource}`, `get{Resource}s`, etc.

### 3. **Type-Safe Field Selection with OptFields**
- Use `OptFields<"operationName">` for `opt_fields` to ensure only valid fields are requested and to enable autocomplete.

### 4. **Consistent Pagination**
- Use the shared `paginate(fetchPage, { limitTotal })` helper for list endpoints. `fetchPage` must accept an `offset` and pass `limit`/`offset` to the client.

### 5. **Expanded Shapes Casting**
- When using `opt_fields` to expand nested objects, define an expanded shape type and use `castWithOptFields<T, K>` or `castArrayWithOptFields<T, K>` to access expanded fields safely.
- Use `WithRequired<T, K>` type utility to make specific keys required in the type.

```typescript
// Example: Projects with team and workspace expanded
import { WithRequired, castArrayWithOptFields, type ProjectResponse } from 'asana-sdk';

type ProjectWithTeamAndWorkspace = WithRequired<ProjectResponse, 'team' | 'workspace'>;

const projects: Array<ProjectWithTeamAndWorkspace> = castArrayWithOptFields<ProjectResponse, 'team' | 'workspace'>(
  await asana.projects.getProjectsForTeam(teamGid, {
    fields: ['name', 'team', 'team.name', 'workspace', 'workspace.name'],
  }),
);
```

### 6. **Expose Types Clearly**
- Export compact and expanded types from resource files and re-export them from the SDK index to keep types discoverable.

### 7. **Error Handling**
- Throw `AsanaApiError` for HTTP failures. Do not throw raw errors. Include meaningful messages.

## Tool Development Guidelines (General)

These apply to any integration (Asana, Calendar, Notion, etc.).

### 1. **Wrap SDKs, Don't Call HTTP Directly**
- Tools should delegate to the corresponding SDK; avoid ad-hoc HTTP requests.

### 2. **Pass Auth via Context**
- Read provider tokens from `experimental_context`; fail fast if missing; never log tokens.

### 3. **Validate Inputs**
- Define Zod schemas per tool; reject invalid inputs before invoking SDK calls.

### 4. **Clear Naming and Outputs**
- Use `{action}{Resource}Tool` naming. Return concise, structured results (not raw SDK responses).

### 5. **Multi-Step Ready**
- Keep tool inputs/outputs small and composable so the model can chain multiple tools when needed.

### 6. **Tool Labels for UI State**
- **Purpose**: Provide user-friendly labels that describe tool execution states in the UI
- **Tool Part Types**: AI SDK generates tool part types as `tool-{package}_{toolName}` (e.g., `tool-asana_listUserProjectsTool`)
- **Implementation**: Export labels alongside tools for UI integration

```typescript
// In individual tool files (e.g., src/listUserProjects.ts)
const labels: ToolLabels = {
  "input-streaming": "Listing projects for the user...",
  "output-available": "Listed projects",
};

export default {
  tool: listUserProjectsTool,
  labels,
};

// In package index.ts - Import and re-export
import listUserProjectsTool from "./src/listUserProjects";

export const asanaTools = {
  asana_listUserProjectsTool: listUserProjectsTool.tool,
};

export const asanaToolLabels: Record<keyof AsanaTools, ToolLabels> = {
  asana_listUserProjectsTool: listUserProjectsTool.labels,
};
```

#### Label Guidelines
- **input-streaming**: What the tool is currently doing (present tense)
- **output-available**: What the tool accomplished (past tense)
- **Be specific and concise**: Use clear action verbs, avoid generic terms like "Working..." or "Done"

### Common Mistakes to Avoid

**SDK Development:**
- **Don't** manually define types that exist in the OpenAPI schema
- **Don't** forget to handle pagination for list endpoints
- **Don't** skip error handling with `AsanaApiError`

**Tool Development:**
- **Don't** make direct HTTP requests in tools (use the SDK)
- **Don't** skip input validation in tools
- **Don't** expose raw API responses in tools (transform them)
- **Don't** forget to pass tokens through the context chain
- **Don't** forget to export tool labels from individual tool files
- **Don't** forget to include tool labels in the package's main export mapping
- **Don't** use generic or verbose labels that don't clearly describe the tool's action

