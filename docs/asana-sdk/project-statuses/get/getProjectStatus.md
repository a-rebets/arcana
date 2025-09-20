# GET /project_statuses/{project_status_gid}

**Summary:** Get a project status

**Description:** *Deprecated: new integrations should prefer the `/status_updates/{status_gid}` route.*

Returns the complete record for a single status update.

**Operation ID:** getProjectStatus

**Tags:** Project statuses

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the specified project's status updates.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "project_status",
    "title": "Status Update - Jun 15",
    "text": "The project is moving forward according to plan...",
    "html_text": "<body>The project <strong>is</strong> moving forward according to plan...</body>",
    "color": "green",
    "author": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "created_by": {},
    "modified_at": "2024-01-01T00:00:00Z"
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

let projectStatusesApiInstance = new Asana.ProjectStatusesApi();
let project_status_gid = "321654"; // String | The project status update to get.
let opts = { 
    'opt_fields': "author,author.name,color,created_at,created_by,created_by.name,html_text,modified_at,text,title"
};
projectStatusesApiInstance.getProjectStatus(project_status_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```