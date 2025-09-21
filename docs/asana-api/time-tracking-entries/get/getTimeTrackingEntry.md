# GET /time_tracking_entries/{time_tracking_entry_gid}

**Summary:** Get a time tracking entry

**Description:** Returns the complete time tracking entry record for a single time tracking entry.

**Operation ID:** getTimeTrackingEntry

**Tags:** Time tracking entries

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| time_tracking_entry_gid | string | ✅ | Globally unique identifier for the time tracking entry. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
approval_status,attributable_to,attributable_to.name,billable_status,created_at,created_by,created_by.name,description,duration_minutes,entered_on,task,task.created_by,task.name,task.resource_subtype
```

## Responses

### 200

Successfully retrieved the requested time tracking entry.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "time_tracking_entry",
    "duration_minutes": 12,
    "entered_on": "2015-03-14",
    "attributable_to": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
    },
    "created_by": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "task": {
      "gid": "12345",
      "resource_type": "task",
      "name": "Bug Task",
      "resource_subtype": "default_task",
      "created_by": {
        "gid": "1111",
        "resource_type": "user"
      }
    },
    "created_at": "2012-02-22T02:06:58.147Z",
    "approval_status": "DRAFT",
    "billable_status": "billable",
    "description": "My description of work done on this entry"
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

