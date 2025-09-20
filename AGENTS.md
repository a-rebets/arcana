# Asana SDK Documentation Structure

This document explains how to navigate the Asana SDK documentation for AI agents.

## Directory Organization

The documentation is located in `docs/asana-sdk/` and organized by API resources:

- Each resource has its own directory (e.g., `tasks/`, `projects/`, `users/`)
- Each resource directory contains an `about.md` file with the resource overview
- Endpoints are organized by HTTP method in subdirectories (`get/`, `post/`, `put/`, `delete/`)

## Key Files

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

