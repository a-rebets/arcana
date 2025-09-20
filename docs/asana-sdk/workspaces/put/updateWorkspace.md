# PUT /workspaces/{workspace_gid}

**Summary:** Update a workspace

**Description:** A specific, existing workspace can be updated by making a PUT request on the URL for that workspace. Only the fields provided in the data block will be updated; any unspecified fields will remain unchanged.
Currently the only field that can be modified for a workspace is its name.
Returns the complete, updated workspace record.

**Operation ID:** updateWorkspace

**Tags:** Workspaces

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The workspace object with all updated properties.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "workspace",
    "name": "My Company Workspace"
  }
}
```

## Responses

### 200

Update for the workspace was successful.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "workspace",
    "name": "My Company Workspace",
    "email_domains": [
      "\"string\""
    ],
    "is_organization": false
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
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The workspace object with all updated properties.
let workspace_gid = "12345"; // String | Globally unique identifier for the workspace or organization.
let opts = { 
    'opt_fields': "email_domains,is_organization,name"
};
workspacesApiInstance.updateWorkspace(body, workspace_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```