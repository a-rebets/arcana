# PUT /memberships/{membership_gid}

**Summary:** Update a membership

**Description:** An existing membership can be updated by making a `PUT` request on the membership. Only the fields provided in the `data` block will be updated;
any unspecified fields will remain unchanged. Memberships on `goals`, `projects`, `portfolios`, and `custom_fields` can be updated.

Returns the full record of the updated membership.

**Operation ID:** updateMembership

**Tags:** Memberships

## Request Body

The membership to update.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "access_level": "editor"
  }
}
```

## Responses

### 200

Successfully updated the requested membership.

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
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The membership to update.
let membership_gid = "12345"; // String | Globally unique identifier for the membership.

membershipsApiInstance.updateMembership(body, membership_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```