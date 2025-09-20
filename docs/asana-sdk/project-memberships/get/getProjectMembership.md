# GET /project_memberships/{project_membership_gid}

**Summary:** Get a project membership

**Description:** Returns the complete project record for a single project membership.

**Operation ID:** getProjectMembership

**Tags:** Project memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the requested project membership.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
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
    "access_level": "admin",
    "user": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "project": {},
    "write_access": "full_write"
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
let project_membership_gid = "1331"; // String | 
let opts = { 
    'opt_fields': "access_level,member,member.name,parent,parent.name,project,project.name,user,user.name,write_access"
};
projectMembershipsApiInstance.getProjectMembership(project_membership_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```