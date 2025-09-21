# GET /allocations

**Summary:** Get multiple allocations

**Description:** Returns a list of allocations filtered to a specific project, user or placeholder.

**Operation ID:** getAllocations

**Tags:** Allocations

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| parent | string | ❌ | Globally unique identifier for the project to filter allocations by. | - | - |
| assignee | string | ❌ | Globally unique identifier for the user or placeholder the allocation is assigned to. | - | - |
| workspace | string | ❌ | Globally unique identifier for the workspace. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
assignee,assignee.name,created_by,created_by.name,effort,effort.type,effort.value,end_date,offset,parent,parent.name,path,resource_subtype,start_date,uri
```

## Responses

### 200

Successfully retrieved the requested allocations.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "allocation",
      "start_date": "2024-02-28",
      "end_date": "2024-02-28",
      "effort": {
        "type": "hours",
        "value": 50
      },
      "assignee": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      },
      "created_by": {},
      "parent": {
        "gid": "12345",
        "resource_type": "project",
        "name": "Stuff to buy"
      },
      "resource_subtype": "project_allocation"
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

