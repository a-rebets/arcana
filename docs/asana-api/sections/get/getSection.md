# GET /sections/{section_gid}

**Summary:** Get a section

**Description:** Returns the complete record for a single section.

**Operation ID:** getSection

**Tags:** Sections

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| section_gid | string | ✅ | The globally unique identifier for the section. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
created_at,name,project,project.name,projects,projects.name
```

## Responses

### 200

Successfully retrieved section.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "section",
    "name": "Next Actions",
    "created_at": "2012-02-22T02:06:58.147Z",
    "project": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
    },
    "projects": [
      {}
    ]
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

