# Arcana: AI-Powered Productivity Integration

Arcana is an AI-powered application that integrates with productivity platforms, starting with Asana. Our goal is to build high-quality, type-safe tools and SDKs that allow LLM models to seamlessly interact with productivity applications, providing users with natural language access to their work data and insights.

This document explains how to navigate the Asana SDK documentation and development guidelines for AI agents working on the Arcana app.

## Asana SDK Documentation Structure

The documentation is located in `docs/asana-sdk/` and organized by API resources:

- Each resource has its own directory (e.g., `tasks/`, `projects/`, `users/`)
- Each resource directory contains an `about.md` file with the resource overview
- Endpoints are organized by HTTP method in subdirectories (`get/`, `post/`, `put/`, `delete/`)

### Resource Overviews
- **Location**: `docs/asana-sdk/{resource}/about.md`
- **Content**: General description, concepts, and use cases for each API resource
- **Example**: `docs/asana-sdk/tasks/about.md` explains what tasks are and how they work

### Individual Endpoints
- **Location**: `docs/asana-sdk/{resource}/{method}/{operationId}.md`
- **Content**: Complete API documentation including parameters, responses, and Node.js examples
- **Example**: `docs/asana-sdk/tasks/post/createTask.md` for creating tasks

### Error Documentation
- **Location**: `docs/asana-sdk/errors.md`
- **Content**: Consolidated error responses (400, 401, 403, 404, 500) with descriptions and examples
- **Usage**: Referenced by `<reference>` tags in endpoint files

## AI SDK Documentation

Additional documentation for AI SDK patterns and best practices:

- **Location**: `docs/ai-sdk/`
- **Content**: AI SDK implementation guides and patterns
- **Key Files**:
  - `tool-calling.md` - Tool calling patterns and examples
  - `ui-message-persistence.md` - Message persistence strategies
  - `ui-tool-usage.md` - UI patterns for tool usage display

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
  - `src/core/types.ts` - `OptFields`, expanded shape helpers
  - `src/resources/*.ts` - Resource creators (e.g. `createWorkspaces`)
  - `src/lib/api.d.ts` - Generated OpenAPI types (do not edit)

#### 2. **packages/tools/asana/** - AI SDK Tools
- **Purpose**: High-level AI tools that wrap the SDK for conversational AI
- **Exports**: Tool definitions with Zod schemas for AI SDK
- **Dependencies**: `asana-sdk`
- **Key Files**:
  - `src/index.ts` - Tool exports
  - `src/http.ts` - SDK client factory with token
  - `src/schemas.ts` - Zod validation schemas
  - `src/listUserProjects.ts` - example tool

#### 3. **packages/web/** - Main Application
- **Purpose**: Convex backend with AI chat interface
- **Dependencies**: `packages/tools/asana/`
- **Key Files**:
  - `convex/chat.ts` - AI chat handler (tools, step runner, context)
  - `convex/asana/oauth/*.ts` - OAuth token management
  - `convex/http.ts` - HTTP router registration
  - `convex/lib/env.ts` - Environment configuration

### Data Flow

1. **Authentication**: OAuth tokens are stored in Convex and passed via `experimental_context`
2. **Tool Execution**: AI calls tools → tools use SDK → SDK makes HTTP requests to Asana
3. **Multi-step Processing**: Convex handler orchestrates multiple tool calls using `stopWhen: stepCountIs(10)`
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
  - When you’ve requested expansions for arrays, use `castExpandedArray<Base, Expanded>` to safely access expanded properties


### 2. **Resource Creator Pattern**
- Implement resources via `create{Resource}(client)` factory functions that return plain-method objects (no classes). Use consistent verbs: `get{Resource}`, `get{Resource}s`, etc.

### 3. **Type-Safe Field Selection with OptFields**
- Use `OptFields<"operationName">` for `opt_fields` to ensure only valid fields are requested and to enable autocomplete.

### 4. **Consistent Pagination**
- Use the shared `paginate(fetchPage, { limitTotal })` helper for list endpoints. `fetchPage` must accept an `offset` and pass `limit`/`offset` to the client.

### 5. **Expanded Shapes Casting**
- When using `opt_fields` to expand nested objects, define an expanded shape type and use `castExpandedArray<Base, Expanded>` to access expanded fields safely.

### 6. **Expose Types Clearly**
- Export compact and expanded types from resource files and re-export them from the SDK index to keep types discoverable.

### 7. **Error Handling**
- Throw `AsanaApiError` for HTTP failures. Do not throw raw errors. Include meaningful messages.

## Tool Development Guidelines (General)

These apply to any integration (Asana, Calendar, Notion, etc.).

### 1. **Wrap SDKs, Don’t Call HTTP Directly**
- Tools should delegate to the corresponding SDK; avoid ad-hoc HTTP requests.

### 2. **Pass Auth via Context**
- Read provider tokens from `experimental_context`; fail fast if missing; never log tokens.

### 3. **Validate Inputs**
- Define Zod schemas per tool; reject invalid inputs before invoking SDK calls.

### 4. **Clear Naming and Outputs**
- Use `{action}{Resource}Tool` naming. Return concise, structured results (not raw SDK responses).

### 5. **Multi-Step Ready**
- Keep tool inputs/outputs small and composable so the model can chain multiple tools when needed.

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

