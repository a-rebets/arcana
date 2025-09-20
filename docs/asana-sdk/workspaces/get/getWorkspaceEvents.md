# GET /workspaces/{workspace_gid}/events

**Summary:** Get workspace events

**Description:** Returns the full record for all events that have occurred since the sync token was created.
The response is a list of events and the schema of each event is as described [here](/reference/events).
Asana limits a single sync token to 1000 events. If more than 1000 events exist for a given domain, `has_more: true` will be returned in the response, indicating that there are more events to pull.

**Operation ID:** getWorkspaceEvents

**Tags:** Workspaces

## Responses

### 200

Successfully retrieved events.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "user": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      },
      "resource": {
        "gid": "12345",
        "resource_type": "task",
        "name": "Bug Task"
      },
      "type": "task",
      "action": "changed",
      "parent": {},
      "created_at": "2024-01-01T00:00:00Z",
      "change": {
        "field": "assignee",
        "action": "changed",
        "new_value": {
          "gid": "12345",
          "resource_type": "user"
        },
        "added_value": {
          "gid": "12345",
          "resource_type": "user"
        },
        "removed_value": {
          "gid": "12345",
          "resource_type": "user"
        }
      }
    }
  ],
  "sync": "de4774f6915eae04714ca93bb2f5ee81",
  "has_more": true
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

let workspacesApiInstance = new Asana.WorkspacesApi();
let workspace_gid = "12345"; // String | Globally unique identifier for the workspace or organization.
let opts = { 
    'sync': "de4774f6915eae04714ca93bb2f5ee81"
};
workspacesApiInstance.getWorkspaceEvents(workspace_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```