# GET /project_statuses/{project_status_gid}

**Summary:** Get a project status

**Description:** *Deprecated: new integrations should prefer the `/status_updates/{status_gid}` route.*

Returns the complete record for a single status update.

**Operation ID:** getProjectStatus

**Tags:** Project statuses

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| project_status_gid | string | ✅ | The project status update to get. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
author,author.name,color,created_at,created_by,created_by.name,html_text,modified_at,text,title
```

## Responses

### 200

Successfully retrieved the specified project's status updates.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "project_status",
    "title": "Status Update - Jun 15",
    "text": "The project is moving forward according to plan...",
    "html_text": "<body>The project <strong>is</strong> moving forward according to plan...</body>",
    "color": "green",
    "author": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "created_at": "2012-02-22T02:06:58.147Z",
    "created_by": {},
    "modified_at": "2012-02-22T02:06:58.147Z"
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

