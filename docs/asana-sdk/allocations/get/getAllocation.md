# GET /allocations/{allocation_gid}

**Summary:** Get an allocation

**Description:** Returns the complete allocation record for a single allocation.

**Operation ID:** getAllocation

**Tags:** Allocations

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| allocation_gid | string | ✅ | Globally unique identifier for the allocation. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
assignee,assignee.name,created_by,created_by.name,effort,effort.type,effort.value,end_date,parent,parent.name,resource_subtype,start_date
```

## Responses

### 200

Successfully retrieved the record for a single allocation.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
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

