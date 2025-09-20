# POST /teams/{team_gid}/addUser

**Summary:** Add a user to a team

**Description:** The user making this call must be a member of the team in order to add others. The user being added must exist in the same organization as the team.

Returns the complete team membership record for the newly added user.

**Operation ID:** addUserForTeam

**Tags:** Teams

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The user to add to the team.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "user": "12345"
  }
}
```

## Responses

### 200

Successfully added user to the team.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
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

let teamsApiInstance = new Asana.TeamsApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The user to add to the team.
let team_gid = "159874"; // String | Globally unique identifier for the team.
let opts = { 
    'opt_fields': "is_admin,is_guest,is_limited_access,team,team.name,user,user.name"
};
teamsApiInstance.addUserForTeam(body, team_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```