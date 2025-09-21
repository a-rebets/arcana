# GET /memberships/{membership_gid}

**Summary:** Get a membership

**Description:** Returns a `project_membership`, `goal_membership`, `portfolio_membership`, or `custom_field_membership` record for a membership id.

**Operation ID:** getMembership

**Tags:** Memberships

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| membership_gid | string | ✅ | Globally unique identifier for the membership. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |

## Responses

### 200

Successfully retrieved the record for a single membership.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "membership",
    "resource_subtype": "goal_membership",
    "member": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "parent": {
      "gid": "12345",
      "resource_type": "goal",
      "name": "Grow web traffic by 30%",
      "owner": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      }
    },
    "role": "editor",
    "access_level": "editor",
    "goal": {},
    "user": {},
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    }
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

