# GET /goal_relationships

**Summary:** Get goal relationships

**Description:** Returns compact goal relationship records.

**Operation ID:** getGoalRelationships

**Tags:** Goal relationships

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| limit | integer | ❌ | Results per page. The number of objects to return per page. The value must be between 1 and 100. | - | min: 1, max: 100 |
| offset | string | ❌ | Offset token. An offset to the next page returned by the API. A pagination request will return an offset token, which can be used as an input parameter to the next request. If an offset is not passed in, the API will return the first page of results. *Note: You can only pass in an offset that was returned to you via a previously paginated request.* | - | - |
| supported_goal | string | ✅ | Globally unique identifier for the supported goal in the goal relationship. | - | - |
| resource_subtype | string | ❌ | If provided, filter to goal relationships with a given resource_subtype. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
contribution_weight,offset,path,resource_subtype,supported_goal,supported_goal.name,supported_goal.owner,supported_goal.owner.name,supporting_resource,supporting_resource.name,uri
```

## Responses

### 200

Successfully retrieved the requested goal relationships.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "goal_relationship",
      "resource_subtype": "subgoal",
      "supporting_resource": {
        "gid": "12345",
        "resource_type": "project",
        "name": "Stuff to buy"
      },
      "contribution_weight": 1
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

