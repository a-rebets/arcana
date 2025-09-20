# GET /memberships/{membership_gid}

**Summary:** Get a membership

**Description:** Returns a `project_membership`, `goal_membership`, `portfolio_membership`, or `custom_field_membership` record for a membership id.

**Operation ID:** getMembership

**Tags:** Memberships

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
    "role": "commenter",
    "access_level": "viewer",
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

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let membershipsApiInstance = new Asana.MembershipsApi();
let membership_gid = "12345"; // String | Globally unique identifier for the membership.

membershipsApiInstance.getMembership(membership_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```