# POST /teams/{team_gid}/removeUser

**Summary:** Remove a user from a team

**Description:** The user making this call must be a member of the team in order to remove themselves or others.

**Operation ID:** removeUserForTeam

**Tags:** Teams

## Request Body

The user to remove from the team.

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

Returns an empty data record

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

let teamsApiInstance = new Asana.TeamsApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The user to remove from the team.
let team_gid = "159874"; // String | Globally unique identifier for the team.

teamsApiInstance.removeUserForTeam(body, team_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```