# GET /teams/{team_gid}

**Summary:** Get a team

**Description:** <b>Required scope: </b><code>teams:read</code>

Returns the full record for a single team.

**Operation ID:** getTeam

**Tags:** Teams

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| team_gid | string | ✅ | Globally unique identifier for the team. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
description,edit_team_name_or_description_access_level,edit_team_visibility_or_trash_team_access_level,endorsed,guest_invite_management_access_level,html_description,join_request_management_access_level,member_invite_management_access_level,name,organization,organization.name,permalink_url,team_content_management_access_level,team_member_removal_access_level,visibility
```

## Responses

### 200

Successfully retrieved the record for a single team.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "team",
    "name": "Marketing",
    "description": "All developers should be members of this team.",
    "html_description": "<body><em>All</em> developers should be members of this team.</body>",
    "organization": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    },
    "permalink_url": "https://app.asana.com/0/resource/123456789/list",
    "visibility": "secret",
    "edit_team_name_or_description_access_level": "all_team_members",
    "edit_team_visibility_or_trash_team_access_level": "all_team_members",
    "member_invite_management_access_level": "all_team_members",
    "guest_invite_management_access_level": "all_team_members",
    "join_request_management_access_level": "all_team_members",
    "team_member_removal_access_level": "all_team_members",
    "team_content_management_access_level": "no_restriction",
    "endorsed": false
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

- **oauth2** (scopes: teams:read)

