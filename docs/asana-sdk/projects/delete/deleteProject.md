# DELETE /projects/{project_gid}

**Summary:** Delete a project

**Description:** <b>Required scope: </b><code>projects:delete</code>

A specific, existing project can be deleted by making a DELETE request on
the URL for that project.

Returns an empty data record.

**Operation ID:** deleteProject

**Tags:** Projects

## Responses

### 200

Successfully deleted the specified project.

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

- **oauth2** (scopes: projects:delete)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let projectsApiInstance = new Asana.ProjectsApi();
let project_gid = "1331"; // String | Globally unique identifier for the project.

projectsApiInstance.deleteProject(project_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```