# GET /events

**Summary:** Get events on a resource

**Description:** Returns the full record for all events that have occurred since the sync
token was created.

A `GET` request to the endpoint `/[path_to_resource]/events` can be made in
lieu of including the resource ID in the data for the request.

Asana limits a single sync token to 100 events. If more than 100 events exist
for a given resource, `has_more: true` will be returned in the response, indicating
that there are more events to pull.

*Note: The resource returned will be the resource that triggered the
event. This may be different from the one that the events were requested
for. For example, a subscription to a project will contain events for
tasks contained within the project.*

**Operation ID:** getEvents

**Tags:** Events

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| resource | string | ✅ | A resource ID to subscribe to. The resource can be a task, project, or goal. | - | - |
| sync | string | ❌ | A sync token received from the last request, or none on first sync. Events will be returned from the point in time that the sync token was generated. *Note: On your first request, omit the sync token. The response will be the same as for an expired sync token, and will include a new valid sync token.If the sync token is too old (which may happen from time to time) the API will return a `412 Precondition Failed` error, and include a fresh sync token in the response.* | - | - |
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
action,change,change.action,change.added_value,change.field,change.new_value,change.removed_value,created_at,parent,parent.name,resource,resource.name,type,user,user.name
```

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

### 412

<reference>

### 500

<reference>

