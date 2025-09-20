# GET /users/{user_gid}/user_task_list

**Summary:** Get a user's task list

**Description:** <b>Required scope: </b><code>tasks:read</code>

Returns the full record for a user's task list.

**Operation ID:** getUserTaskListForUser

**Tags:** User task lists

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

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


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let userTaskListsApiInstance = new Asana.UserTaskListsApi();
let user_gid = "me"; // String | A string identifying a user. This can either be the string \"me\", an email, or the gid of a user.
let workspace = "1234"; // String | The workspace in which to get the user task list.
let opts = { 
    'opt_fields': "name,owner,workspace"
};
userTaskListsApiInstance.getUserTaskListForUser(user_gid, workspace, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```