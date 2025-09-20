# DELETE /project_statuses/{project_status_gid}

**Summary:** Delete a project status

**Description:** *Deprecated: new integrations should prefer the `/status_updates/{status_gid}` route.*

Deletes a specific, existing project status update.

Returns an empty data record.

**Operation ID:** deleteProjectStatus

**Tags:** Project statuses

## Responses

### 200

Successfully deleted the specified project status.

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

let projectStatusesApiInstance = new Asana.ProjectStatusesApi();
let project_status_gid = "321654"; // String | The project status update to get.

projectStatusesApiInstance.deleteProjectStatus(project_status_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```