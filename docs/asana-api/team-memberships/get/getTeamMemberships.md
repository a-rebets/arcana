# GET /team_memberships

**Summary:** Get team memberships

**Description:** <b>Required scope: </b><code>team_memberships:read</code>

Returns compact team membership records.

**Operation ID:** getTeamMemberships

**Tags:** Team memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| team | string | ❌ | Globally unique identifier for the team. | - | - |
| user | string | ❌ | A string identifying a user. This can either be the string "me", an email, or the gid of a user. This parameter must be used with the workspace parameter. | - | - |
| workspace | string | ❌ | Globally unique identifier for the workspace. This parameter must be used with the user parameter. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
is_admin,is_guest,is_limited_access,offset,path,team,team.name,uri,user,user.name
```

## Responses

### 200

Successfully retrieved the requested team memberships.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
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

- **oauth2** (scopes: team_memberships:read)

