# GET /memberships

**Summary:** Get multiple memberships

**Description:** Returns compact `goal_membership`, `project_membership`, `portfolio_membership`, or `custom_field_membership` records. The possible types for `parent` in this request are `goal`, `project`, `portfolio`, or `custom_field`. An additional member (user GID or team GID) can be passed in to filter to a specific membership.

**Operation ID:** getMemberships

**Tags:** Memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| parent | string | ❌ | Globally unique identifier for `goal`, `project`, `portfolio`, or `custom_field`. | - | - |
| member | string | ❌ | Globally unique identifier for `team` or `user`. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
offset,path,uri
```

## Responses

### 200

Successfully retrieved the requested membership.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
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
      "is_commenter": false,
      "is_editor": false
    },
    {
      "gid": "12345",
      "resource_type": "membership",
      "parent": {
        "gid": "12345",
        "resource_type": "project",
        "name": "Stuff to buy"
      },
      "member": {},
      "access_level": "admin",
      "resource_subtype": "project_membership"
    },
    {
      "gid": "12345",
      "resource_type": "membership",
      "parent": {
        "gid": "12345",
        "resource_type": "portfolio",
        "name": "Bug Portfolio"
      },
      "member": {},
      "access_level": "admin",
      "resource_subtype": "portfolio_membership"
    },
    {
      "gid": "12345",
      "resource_type": "custom_field_membership",
      "resource_subtype": "custom_field_membership",
      "parent": {
        "gid": "12345",
        "resource_type": "custom_field",
        "name": "Status",
        "type": "text",
        "enum_options": [
          {
            "gid": "12345",
            "resource_type": "enum_option",
            "name": "Low",
            "enabled": true,
            "color": "blue"
          }
        ],
        "enabled": true,
        "representation_type": "number",
        "id_prefix": "ID",
        "is_formula_field": false,
        "date_value": {
          "date": "2024-08-23",
          "date_time": "2024-08-23T22:00:00.000Z"
        },
        "enum_value": {},
        "multi_enum_values": [
          {}
        ],
        "number_value": 5.2,
        "text_value": "Some Value",
        "display_value": "blue"
      },
      "member": {},
      "access_level": "admin"
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

