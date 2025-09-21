# GET /users/{user_gid}

**Summary:** Get a user

**Description:** <b>Required scope: </b><code>users:read</code>

Returns the full user record for the single user with the provided ID.

**Operation ID:** getUser

**Tags:** Users

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| user_gid | string | ✅ | A string identifying a user. This can either be the string "me", an email, or the gid of a user. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
email,name,photo,photo.image_1024x1024,photo.image_128x128,photo.image_21x21,photo.image_27x27,photo.image_36x36,photo.image_60x60,workspaces,workspaces.name
```

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
    "email": "gsanchez@example.com",
    "photo": {
      "image_21x21": "https://...",
      "image_27x27": "https://...",
      "image_36x36": "https://...",
      "image_60x60": "https://...",
      "image_128x128": "https://...",
      "image_1024x1024": "https://..."
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

