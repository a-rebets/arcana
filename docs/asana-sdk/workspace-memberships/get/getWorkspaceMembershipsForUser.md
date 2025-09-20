# GET /users/{user_gid}/workspace_memberships

**Summary:** Get workspace memberships for a user

**Description:** Returns the compact workspace membership records for the user.

**Operation ID:** getWorkspaceMembershipsForUser

**Tags:** Workspace memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the requested user's workspace memberships.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
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
      }
    }
  ],
  "next_page": {
    "offset": "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9",
    "path": "/tasks/12345/attachments?limit=2&offset=eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9",
    "uri": "https://app.asana.com/api/1.0/tasks/12345/attachments?limit=2&offset=eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9"
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
let user_gid = "me"; // String | A string identifying a user. This can either be the string \"me\", an email, or the gid of a user.
let opts = { 
    'limit': 50, 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "created_at,is_active,is_admin,is_guest,is_view_only,offset,path,uri,user,user.name,user_task_list,user_task_list.name,user_task_list.owner,user_task_list.workspace,vacation_dates,vacation_dates.end_on,vacation_dates.start_on,workspace,workspace.name"
};
workspaceMembershipsApiInstance.getWorkspaceMembershipsForUser(user_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```