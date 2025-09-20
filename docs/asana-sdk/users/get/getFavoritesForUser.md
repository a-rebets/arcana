# GET /users/{user_gid}/favorites

**Summary:** Get a user's favorites

**Description:** <b>Required scope: </b><code>users:read</code>

Returns all of a user's favorites within a specified workspace and of a given type. The results are ordered exactly as they appear in the user's Asana sidebar in the web application. Note that this endpoint currently only returns favorites for the current user (i.e., the user associated with the authentication token).

**Operation ID:** getFavoritesForUser

**Tags:** Users

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Returns the specified user's favorites.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "task",
      "name": "Bug Task"
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

- **oauth2** (scopes: users:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let usersApiInstance = new Asana.UsersApi();
let user_gid = "me"; // String | A string identifying a user. This can either be the string \"me\", an email, or the gid of a user.
let resource_type = "project"; // String | The resource type of favorites to be returned.
let workspace = "1234"; // String | The workspace in which to get favorites.
let opts = { 
    'limit': 50, 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "name,offset,path,uri"
};
usersApiInstance.getFavoritesForUser(user_gid, resource_type, workspace, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```