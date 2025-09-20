# POST /workspaces/{workspace_gid}/addUser

**Summary:** Add a user to a workspace or organization

**Description:** Add a user to a workspace or organization.
The user can be referenced by their globally unique user ID or their email address. Returns the full user record for the invited user.

**Operation ID:** addUserForWorkspace

**Tags:** Workspaces

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The user to add to the workspace.

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

The user was added successfully to the workspace or organization.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "user",
    "name": "Greg Sanchez",
    "email": "user@example.com",
    "photo": {
      "image_21x21": "\"PNG image of the user at 21x21 pixels.\"",
      "image_27x27": "\"PNG image of the user at 27x27 pixels.\"",
      "image_36x36": "\"PNG image of the user at 36x36 pixels.\"",
      "image_60x60": "\"PNG image of the user at 60x60 pixels.\"",
      "image_128x128": "\"PNG image of the user at 128x128 pixels.\"",
      "image_1024x1024": "\"JPEG image of the user at 1024x1024 pixels.\""
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

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let workspacesApiInstance = new Asana.WorkspacesApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The user to add to the workspace.
let workspace_gid = "12345"; // String | Globally unique identifier for the workspace or organization.
let opts = { 
    'opt_fields': "email,name,photo,photo.image_1024x1024,photo.image_128x128,photo.image_21x21,photo.image_27x27,photo.image_36x36,photo.image_60x60"
};
workspacesApiInstance.addUserForWorkspace(body, workspace_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```