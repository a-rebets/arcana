# GET /time_tracking_entries

**Summary:** Get multiple time tracking entries

**Description:** Returns a list of time tracking entries filtered to a task, attributed project, portfolio or user.

**Operation ID:** getTimeTrackingEntries

**Tags:** Time tracking entries

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| task | string | ❌ | Globally unique identifier for the task to filter time tracking entries by. | - | - |
| attributable_to | string | ❌ | Globally unique identifier for the project the time tracking entries are attributed to. | - | - |
| portfolio | string | ❌ | Globally unique identifier for the portfolio to filter time tracking entries by. | - | - |
| user | string | ❌ | Globally unique identifier for the user to filter time tracking entries by. | - | - |
| workspace | string | ❌ | Globally unique identifier for the workspace. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
attributable_to,attributable_to.name,created_by,created_by.name,duration_minutes,entered_on,offset,path,uri
```

## Responses

### 200

Successfully retrieved the requested time tracking entries.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
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
      }
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

### 402

<reference>

### 403

<reference>

### 404

<reference>

### 500

<reference>

