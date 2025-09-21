# GET /goal_relationships/{goal_relationship_gid}

**Summary:** Get a goal relationship

**Description:** Returns the complete updated goal relationship record for a single goal relationship.

**Operation ID:** getGoalRelationship

**Tags:** Goal relationships

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| goal_relationship_gid | string | ✅ | Globally unique identifier for the goal relationship. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
contribution_weight,resource_subtype,supported_goal,supported_goal.name,supported_goal.owner,supported_goal.owner.name,supporting_resource,supporting_resource.name
```

## Responses

### 200

Successfully retrieved the record for the goal relationship.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "goal_relationship",
    "resource_subtype": "subgoal",
    "supporting_resource": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
    },
    "contribution_weight": 1,
    "supported_goal": {
      "gid": "12345",
      "resource_type": "goal",
      "name": "Grow web traffic by 30%",
      "owner": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      }
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

