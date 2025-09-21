# GET /status_updates

**Summary:** Get status updates from an object

**Description:** Returns the compact status update records for all updates on the object.

**Operation ID:** getStatusesForObject

**Tags:** Status updates

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| parent | string | ✅ | Globally unique identifier for object to fetch statuses from. Must be a GID for a project, portfolio, or goal. | - | - |
| created_since | string (date-time) | ❌ | Only return statuses that have been created since the given time. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
author,author.name,created_at,created_by,created_by.name,hearted,hearts,hearts.user,hearts.user.name,html_text,liked,likes,likes.user,likes.user.name,modified_at,num_hearts,num_likes,offset,parent,parent.name,path,reaction_summary,reaction_summary.count,reaction_summary.emoji_base,reaction_summary.reacted,reaction_summary.variant,resource_subtype,status_type,text,title,uri
```

## Responses

### 200

Successfully retrieved the specified object's status updates.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "status_update",
      "title": "Status Update - Jun 15",
      "resource_subtype": "project_status_update"
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

### 403

<reference>

### 404

<reference>

### 500

<reference>

