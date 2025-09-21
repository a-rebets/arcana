# GET /workspaces/{workspace_gid}

**Summary:** Get a workspace

**Description:** <b>Required scope: </b><code>workspaces:read</code>

Returns the full workspace record for a single workspace.

**Operation ID:** getWorkspace

**Tags:** Workspaces

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| workspace_gid | string | ✅ | Globally unique identifier for the workspace or organization. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
email_domains,is_organization,name
```

## Responses

### 200

Return the full workspace record.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "workspace",
    "name": "My Company Workspace",
    "email_domains": [
      "asana.com"
    ],
    "is_organization": false
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

- **oauth2** (scopes: workspaces:read)

