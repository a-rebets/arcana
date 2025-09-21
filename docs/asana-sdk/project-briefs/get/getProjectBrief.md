# GET /project_briefs/{project_brief_gid}

**Summary:** Get a project brief

**Description:** Get the full record for a project brief.

**Operation ID:** getProjectBrief

**Tags:** Project briefs

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| project_brief_gid | string | ✅ | Globally unique identifier for the project brief. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
html_text,permalink_url,project,project.name,text,title
```

## Responses

### 200

Successfully retrieved the record for a project brief.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "project_brief",
    "title": "Stuff to buy — Project Brief",
    "html_text": "<body>This is a <strong>project brief</strong>.</body>",
    "text": "This is a project brief.",
    "permalink_url": "https://app.asana.com/0/11111111/22222222",
    "project": {
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

### 402

<reference>

### 403

<reference>

### 404

<reference>

### 424

<reference>

### 500

<reference>

### 501

<reference>

### 503

<reference>

### 504

<reference>

