# GET /projects/{project_gid}/project_memberships

**Summary:** Get memberships from a project

**Description:** Returns the compact project membership records for the project.

**Operation ID:** getProjectMembershipsForProject

**Tags:** Project memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the requested project's memberships.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "project_membership",
      "parent": {
        "gid": "12345",
        "resource_type": "project",
        "name": "Stuff to buy"
      },
      "member": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      },
      "access_level": "admin"
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

let projectMembershipsApiInstance = new Asana.ProjectMembershipsApi();
let project_gid = "1331"; // String | Globally unique identifier for the project.
let opts = { 
    'user': "me", 
    'limit': 50, 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "access_level,member,member.name,offset,parent,parent.name,path,uri"
};
projectMembershipsApiInstance.getProjectMembershipsForProject(project_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```