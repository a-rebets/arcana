# GET /team_memberships/{team_membership_gid}

**Summary:** Get a team membership

**Description:** <b>Required scope: </b><code>team_memberships:read</code>

<table>
  <tr>
    <th>Field</th>
    <th>Required Scope</th>
  </tr>
  <tr>
    <td><code>team</code></td>
    <td><code>teams:read</code></td>
  </tr>
</table>

Returns the complete team membership record for a single team membership.

**Operation ID:** getTeamMembership

**Tags:** Team memberships

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| team_membership_gid | string | ✅ | No description | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
is_admin,is_guest,is_limited_access,team,team.name,user,user.name
```

## Responses

### 200

Successfully retrieved the requested team membership.

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

## Security

- **oauth2** (scopes: team_memberships:read)

