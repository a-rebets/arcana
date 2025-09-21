# GET /reactions

**Summary:** Get reactions with an emoji base on an object.

**Description:** Returns the reactions with a specified emoji base character on the object.

**Operation ID:** getReactionsOnObject

**Tags:** Reactions

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| target | string | ✅ | Globally unique identifier for object to fetch reactions from. Must be a GID for a status update or story. | - | - |
| emoji_base | string | ✅ | Only return reactions with this emoji base character. | - | - |

## Responses

### 200

Successfully retrieved the specified object's reactions.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "emoji": "👍",
      "user": {
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

### 403

<reference>

### 404

<reference>

### 500

<reference>

