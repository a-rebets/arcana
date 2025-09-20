# POST /workspaces/{workspace_gid}/removeUser

**Summary:** Remove a user from a workspace or organization

**Description:** Remove a user from a workspace or organization.
The user making this call must be an admin in the workspace. The user can be referenced by their globally unique user ID or their email address.
Returns an empty data record.

**Operation ID:** removeUserForWorkspace

**Tags:** Workspaces

## Request Body

The user to remove from the workspace.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "user": "12345"
  }
}
```

## Responses

### 200

The user was removed successfully to the workspace or organization.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {}
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

let workspacesApiInstance = new Asana.WorkspacesApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The user to remove from the workspace.
let workspace_gid = "12345"; // String | Globally unique identifier for the workspace or organization.

workspacesApiInstance.removeUserForWorkspace(body, workspace_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```