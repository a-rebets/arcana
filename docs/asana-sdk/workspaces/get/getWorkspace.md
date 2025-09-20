# GET /workspaces/{workspace_gid}

**Summary:** Get a workspace

**Description:** <b>Required scope: </b><code>workspaces:read</code>

Returns the full workspace record for a single workspace.

**Operation ID:** getWorkspace

**Tags:** Workspaces

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Return the full workspace record.

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

## Security

- **oauth2** (scopes: workspaces:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let workspacesApiInstance = new Asana.WorkspacesApi();
let workspace_gid = "12345"; // String | Globally unique identifier for the workspace or organization.
let opts = { 
    'opt_fields': "email_domains,is_organization,name"
};
workspacesApiInstance.getWorkspace(workspace_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```