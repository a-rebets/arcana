# GET /workspaces/{workspace_gid}/events

**Summary:** Get workspace events

**Description:** Returns the full record for all events that have occurred since the sync token was created.
The response is a list of events and the schema of each event is as described [here](/reference/events).
Asana limits a single sync token to 1000 events. If more than 1000 events exist for a given domain, `has_more: true` will be returned in the response, indicating that there are more events to pull.

**Operation ID:** getWorkspaceEvents

**Tags:** Workspaces

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| workspace_gid | string | ✅ | Globally unique identifier for the workspace or organization. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| sync | string | ❌ | A sync token received from the last request, or none on first sync. Events will be returned from the point in time that the sync token was generated. *Note: On your first request, omit the sync token. The response will be the same as for an expired sync token, and will include a new valid sync token. If the sync token is too old (which may happen from time to time) the API will return a `412 Precondition Failed` error, and include a fresh sync token in the response.* | - | - |

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
      "created_at": "2012-02-22T02:06:58.147Z",
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

