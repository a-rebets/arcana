# POST /projects/{project_gid}/removeCustomFieldSetting

**Summary:** Remove a custom field from a project

**Description:** <b>Required scope: </b><code>projects:write</code>

Removes a custom field setting from a project.

**Operation ID:** removeCustomFieldSettingForProject

**Tags:** Projects

## Request Body

Information about the custom field setting being removed.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "custom_field": "14916"
  }
}
```

## Responses

### 200

Successfully removed the custom field from the project.

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

## Security

- **oauth2** (scopes: projects:write)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let projectsApiInstance = new Asana.ProjectsApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | Information about the custom field setting being removed.
let project_gid = "1331"; // String | Globally unique identifier for the project.

projectsApiInstance.removeCustomFieldSettingForProject(body, project_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```