# POST /projects/{project_gid}/project_statuses

**Summary:** Create a project status

**Description:** *Deprecated: new integrations should prefer the `/status_updates` route.*

Creates a new status update on the project.

Returns the full record of the newly created project status update.

**Operation ID:** createProjectStatusForProject

**Tags:** Project statuses

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The project status to create.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "project_status",
    "title": "Status Update - Jun 15",
    "text": "The project is moving forward according to plan...",
    "html_text": "<body>The project <strong>is</strong> moving forward according to plan...</body>",
    "color": "green"
  }
}
```

## Responses

### 201

Successfully created a new story.

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
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The project status to create.
let project_gid = "1331"; // String | Globally unique identifier for the project.
let opts = { 
    'opt_fields': "author,author.name,color,created_at,created_by,created_by.name,html_text,modified_at,text,title"
};
projectStatusesApiInstance.createProjectStatusForProject(body, project_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```