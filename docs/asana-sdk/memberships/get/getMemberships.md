# GET /memberships

**Summary:** Get multiple memberships

**Description:** Returns compact `goal_membership`, `project_membership`, `portfolio_membership`, or `custom_field_membership` records. The possible types for `parent` in this request are `goal`, `project`, `portfolio`, or `custom_field`. An additional member (user GID or team GID) can be passed in to filter to a specific membership.

**Operation ID:** getMemberships

**Tags:** Memberships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| parent | string | ❌ | Globally unique identifier for `goal`, `project`, `portfolio`, or `custom_field`. | - | - |
| member | string | ❌ | Globally unique identifier for `team` or `user`. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

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
      "role": "commenter",
      "access_level": "viewer",
      "goal": {},
      "is_commenter": false,
      "is_editor": false
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

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let membershipsApiInstance = new Asana.MembershipsApi();
let opts = { 
    'parent': "159874", 
    'member': "1061493", 
    'limit': 50, 
    'offset': "eyJ0eXAiOJiKV1iQLCJhbGciOiJIUzI1NiJ9", 
    'opt_fields': "offset,path,uri"
};
membershipsApiInstance.getMemberships(opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```