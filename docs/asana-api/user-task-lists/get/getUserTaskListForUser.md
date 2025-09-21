# GET /users/{user_gid}/user_task_list

**Summary:** Get a user's task list

**Description:** <b>Required scope: </b><code>tasks:read</code>

Returns the full record for a user's task list.

**Operation ID:** getUserTaskListForUser

**Tags:** User task lists

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| user_gid | string | ✅ | A string identifying a user. This can either be the string "me", an email, or the gid of a user. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| workspace | string | ✅ | The workspace in which to get the user task list. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
name,owner,workspace
```

## Responses

### 200

Successfully retrieved the user's task list.

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

