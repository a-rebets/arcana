# GET /user_task_lists/{user_task_list_gid}

**Summary:** Get a user task list

**Description:** <b>Required scope: </b><code>tasks:read</code>

Returns the full record for a user task list.

**Operation ID:** getUserTaskList

**Tags:** User task lists

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| user_task_list_gid | string | ✅ | Globally unique identifier for the user task list. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
name,owner,workspace
```

## Responses

### 200

Successfully retrieved the user task list.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "user_task_list",
    "name": "My tasks in My Workspace",
    "owner": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    }
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

- **oauth2** (scopes: tasks:read)

