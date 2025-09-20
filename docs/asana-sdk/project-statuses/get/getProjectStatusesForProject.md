# GET /projects/{project_gid}/project_statuses

**Summary:** Get statuses from a project

**Description:** *Deprecated: new integrations should prefer the `/status_updates` route.*

Returns the compact project status update records for all updates on the project.

**Operation ID:** getProjectStatusesForProject

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
  "data": [
    {
      "gid": "12345",
      "resource_type": "project_status",
      "title": "Status Update - Jun 15"
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

let projectStatusesApiInstance = new Asana.ProjectStatusesApi();
let project_gid = "1331"; // String | Globally unique identifier for the project.
let opts = { 
    'limit': 50, 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "author,author.name,color,created_at,created_by,created_by.name,html_text,modified_at,offset,path,text,title,uri"
};
projectStatusesApiInstance.getProjectStatusesForProject(project_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```