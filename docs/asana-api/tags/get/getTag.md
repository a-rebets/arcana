# GET /tags/{tag_gid}

**Summary:** Get a tag

**Description:** <b>Required scope: </b><code>tags:read</code>

<table>
  <tr>
    <th>Field</th>
    <th>Required Scope</th>
  </tr>
  <tr>
    <td><code>workspace</code></td>
    <td><code>workspaces:read</code></td>
  </tr>
  <tr>
    <td><code>followers</code></td>
    <td><code>users:read</code></td>
  </tr>
</table>

Returns the complete tag record for a single tag.

**Operation ID:** getTag

**Tags:** Tags

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| tag_gid | string | ✅ | Globally unique identifier for the tag. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
color,created_at,followers,followers.name,name,notes,permalink_url,workspace,workspace.name
```

## Responses

### 200

Successfully retrieved the specified tag.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "tag",
    "name": "Stuff to buy",
    "color": "light-green",
    "notes": "Mittens really likes the stuff from Humboldt.",
    "created_at": "2012-02-22T02:06:58.147Z",
    "followers": [
      {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      }
    ],
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    },
    "permalink_url": "https://app.asana.com/0/resource/123456789/list"
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

- **oauth2** (scopes: tags:read)

