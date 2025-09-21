# GET /workspace_memberships/{workspace_membership_gid}

**Summary:** Get a workspace membership

**Description:** Returns the complete workspace record for a single workspace membership.

**Operation ID:** getWorkspaceMembership

**Tags:** Workspace memberships

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| workspace_membership_gid | string | ✅ | No description | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
created_at,is_active,is_admin,is_guest,is_view_only,user,user.name,user_task_list,user_task_list.name,user_task_list.owner,user_task_list.workspace,vacation_dates,vacation_dates.end_on,vacation_dates.start_on,workspace,workspace.name
```

## Responses

### 200

Successfully retrieved the requested workspace membership.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "workspace_membership",
    "user": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    },
    "user_task_list": {
      "gid": "12345",
      "resource_type": "user_task_list",
      "name": "My tasks in My Workspace",
      "owner": {},
      "workspace": {}
    },
    "is_active": true,
    "is_admin": true,
    "is_guest": true,
    "is_view_only": true,
    "vacation_dates": {
      "start_on": "2022-11-05",
      "end_on": "2022-11-07"
    },
    "created_at": "2012-02-22T02:06:58.147Z"
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

