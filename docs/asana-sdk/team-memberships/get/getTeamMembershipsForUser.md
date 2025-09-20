# GET /users/{user_gid}/team_memberships

**Summary:** Get memberships from a user

**Description:** <b>Required scope: </b><code>team_memberships:read</code>

Returns the compact team membership records for the user.

**Operation ID:** getTeamMembershipsForUser

**Tags:** Team memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| workspace | string | ✅ | Globally unique identifier for the workspace. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the requested users's memberships.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "team_membership",
      "user": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      },
      "team": {
        "gid": "12345",
        "resource_type": "team",
        "name": "Marketing"
      },
      "is_guest": false,
      "is_limited_access": false,
      "is_admin": false
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

## Security

- **oauth2** (scopes: team_memberships:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let teamMembershipsApiInstance = new Asana.TeamMembershipsApi();
let user_gid = "me"; // String | A string identifying a user. This can either be the string \"me\", an email, or the gid of a user.
let workspace = "31326"; // String | Globally unique identifier for the workspace.
let opts = { 
    'limit': 50, 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "is_admin,is_guest,is_limited_access,offset,path,team,team.name,uri,user,user.name"
};
teamMembershipsApiInstance.getTeamMembershipsForUser(user_gid, workspace, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```