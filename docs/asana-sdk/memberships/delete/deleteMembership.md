# DELETE /memberships/{membership_gid}

**Summary:** Delete a membership

**Description:** A specific, existing membership for a `goal`, `project`, `portfolio` or `custom_field` can be deleted by making a `DELETE` request
on the URL for that membership.

Returns an empty data record.

**Operation ID:** deleteMembership

**Tags:** Memberships

## Responses

### 200

Successfully deleted the requested membership.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {}
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

membershipsApiInstance.deleteMembership(membership_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```