# POST /memberships

**Summary:** Create a membership

**Description:** Creates a new membership in a `goal`, `project`, `portfolio`, or `custom_field`, where members can be Teams or Users.

Returns the full record of the newly created membership.

**Operation ID:** createMembership

**Tags:** Memberships

## Request Body

The updated fields for the membership.

**Required:** ❌ Optional

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "access_level": "editor",
    "member": 12345,
    "parent": "987654",
    "role": "editor"
  }
}
```

## Responses

### 201

Successfully created the requested membership.

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
let opts = { 
    'body': {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}
};
membershipsApiInstance.createMembership(opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```