# GET /teams/{team_gid}/users

**Summary:** Get users in a team

**Description:** <b>Required scope: </b><code>users:read</code>

Returns the compact records for all users that are members of the team.
Results are sorted alphabetically and limited to 2000. For more results use the `/users` endpoint.

**Operation ID:** getUsersForTeam

**Tags:** Users

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Returns the user records for all the members of the team, including guests and limited access users

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    }
  ]
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

- **oauth2** (scopes: users:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let usersApiInstance = new Asana.UsersApi();
let team_gid = "159874"; // String | Globally unique identifier for the team.
let opts = { 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "email,name,photo,photo.image_1024x1024,photo.image_128x128,photo.image_21x21,photo.image_27x27,photo.image_36x36,photo.image_60x60,workspaces,workspaces.name"
};
usersApiInstance.getUsersForTeam(team_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```