# GET /projects/{project_gid}/task_counts

**Summary:** Get task count of a project

**Description:** <b>Required scope: </b><code>projects:read</code>

<table>
  <tr>
    <th>Field</th>
    <th>Required Scope</th>
  </tr>
  <tr>
    <td><code>custom_field_settings</code></td>
    <td><code>custom_fields:read</code></td>
  </tr>
  <tr>
    <td><code>team</code></td>
    <td><code>teams:read</code></td>
  </tr>
</table>

Get an object that holds task count fields. **All fields are excluded by default**. You must [opt in](/docs/inputoutput-options) using `opt_fields` to get any information from this endpoint.

This endpoint has an additional [rate limit](/docs/rate-limits) and each field counts especially high against our [cost limits](/docs/rate-limits#cost-limits).

Milestones are just tasks, so they are included in the `num_tasks`, `num_incomplete_tasks`, and `num_completed_tasks` counts.

**Operation ID:** getTaskCountsForProject

**Tags:** Projects

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| project_gid | string | ✅ | Globally unique identifier for the project. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
num_completed_milestones,num_completed_tasks,num_incomplete_milestones,num_incomplete_tasks,num_milestones,num_tasks
```

## Responses

### 200

Successfully retrieved the requested project's task counts.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "num_tasks": 200,
    "num_incomplete_tasks": 50,
    "num_completed_tasks": 150,
    "num_milestones": 10,
    "num_incomplete_milestones": 7,
    "num_completed_milestones": 3
  }
}
```

### 400

<reference>

### 401

<reference>

### 403

<reference>

### 404

<reference>

### 500

<reference>

## Security

- **oauth2** (scopes: projects:read)

