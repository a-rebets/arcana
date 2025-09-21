# GET /status_updates/{status_update_gid}

**Summary:** Get a status update

**Description:** Returns the complete record for a single status update.

**Operation ID:** getStatus

**Tags:** Status updates

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| status_update_gid | string | ✅ | The status update to get. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
author,author.name,created_at,created_by,created_by.name,hearted,hearts,hearts.user,hearts.user.name,html_text,liked,likes,likes.user,likes.user.name,modified_at,num_hearts,num_likes,parent,parent.name,reaction_summary,reaction_summary.count,reaction_summary.emoji_base,reaction_summary.reacted,reaction_summary.variant,resource_subtype,status_type,text,title
```

## Responses

### 200

Successfully retrieved the specified object's status updates.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_subtype": "project_status_update",
    "text": "The project is moving forward according to plan...",
    "html_text": "<body>The project <strong>is</strong> moving forward according to plan...</body>",
    "status_type": "on_track",
    "author": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "created_at": "2012-02-22T02:06:58.147Z",
    "created_by": {},
    "hearted": true,
    "hearts": [
      {
        "gid": "12345",
        "user": {}
      }
    ],
    "liked": true,
    "likes": [
      {}
    ],
    "reaction_summary": [
      {
        "emoji_base": "👎",
        "variant": "👎🏼",
        "count": 1,
        "reacted": false
      }
    ],
    "modified_at": "2012-02-22T02:06:58.147Z",
    "num_hearts": 5,
    "parent": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
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

