# GET /users/{user_gid}

**Summary:** Get a user

**Description:** <b>Required scope: </b><code>users:read</code>

Returns the full user record for the single user with the provided ID.

**Operation ID:** getUser

**Tags:** Users

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Returns the user specified.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "user",
    "name": "Greg Sanchez",
    "email": "user@example.com",
    "photo": {
      "image_21x21": "\"PNG image of the user at 21x21 pixels.\"",
      "image_27x27": "\"PNG image of the user at 27x27 pixels.\"",
      "image_36x36": "\"PNG image of the user at 36x36 pixels.\"",
      "image_60x60": "\"PNG image of the user at 60x60 pixels.\"",
      "image_128x128": "\"PNG image of the user at 128x128 pixels.\"",
      "image_1024x1024": "\"JPEG image of the user at 1024x1024 pixels.\""
    },
    "workspaces": [
      {
        "gid": "12345",
        "resource_type": "workspace",
        "name": "My Company Workspace"
      }
    ]
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
let opts = { 
    'opt_fields': "email,name,photo,photo.image_1024x1024,photo.image_128x128,photo.image_21x21,photo.image_27x27,photo.image_36x36,photo.image_60x60,workspaces,workspaces.name"
};
usersApiInstance.getUser(user_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```