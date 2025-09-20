# GET /workspace_memberships/{workspace_membership_gid}

**Summary:** Get a workspace membership

**Description:** Returns the complete workspace record for a single workspace membership.

**Operation ID:** getWorkspaceMembership

**Tags:** Workspace memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

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
    "created_at": "2024-01-01T00:00:00Z"
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

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let workspaceMembershipsApiInstance = new Asana.WorkspaceMembershipsApi();
let workspace_membership_gid = "12345"; // String | 
let opts = { 
    'opt_fields': "created_at,is_active,is_admin,is_guest,is_view_only,user,user.name,user_task_list,user_task_list.name,user_task_list.owner,user_task_list.workspace,vacation_dates,vacation_dates.end_on,vacation_dates.start_on,workspace,workspace.name"
};
workspaceMembershipsApiInstance.getWorkspaceMembership(workspace_membership_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```