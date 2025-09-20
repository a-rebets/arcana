# GET /teams/{team_gid}

**Summary:** Get a team

**Description:** <b>Required scope: </b><code>teams:read</code>

Returns the full record for a single team.

**Operation ID:** getTeam

**Tags:** Teams

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the record for a single team.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "team",
    "name": "Marketing",
    "description": "All developers should be members of this team.",
    "html_description": "<body><em>All</em> developers should be members of this team.</body>",
    "organization": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    },
    "permalink_url": "https://app.asana.com/0/resource/123456789/list",
    "visibility": "secret",
    "edit_team_name_or_description_access_level": "all_team_members",
    "edit_team_visibility_or_trash_team_access_level": "all_team_members",
    "member_invite_management_access_level": "all_team_members",
    "guest_invite_management_access_level": "all_team_members",
    "join_request_management_access_level": "all_team_members",
    "team_member_removal_access_level": "all_team_members",
    "team_content_management_access_level": "no_restriction",
    "endorsed": false
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

- **oauth2** (scopes: teams:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let teamsApiInstance = new Asana.TeamsApi();
let team_gid = "159874"; // String | Globally unique identifier for the team.
let opts = { 
    'opt_fields': "description,edit_team_name_or_description_access_level,edit_team_visibility_or_trash_team_access_level,endorsed,guest_invite_management_access_level,html_description,join_request_management_access_level,member_invite_management_access_level,name,organization,organization.name,permalink_url,team_content_management_access_level,team_member_removal_access_level,visibility"
};
teamsApiInstance.getTeam(team_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```