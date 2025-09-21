# GET /tasks/{task_gid}

**Summary:** Get a task

**Description:** <b>Required scope: </b><code>tasks:read</code>

<table>
  <tr>
    <th>Field</th>
    <th>Required Scope</th>
  </tr>
  <tr>
    <td><code>memberships</code></td>
    <td><code>projects:read</code>, <code>project_sections:read</code></td>
  </tr>
  <tr>
    <td><code>actual_time_minutes</code></td>
    <td><code>time_tracking_entries:read</code></td>
  </tr>
</table>

Returns the complete task record for a single task.

**Operation ID:** getTask

**Tags:** Tasks

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| task_gid | string | ✅ | The task to operate on. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
actual_time_minutes,approval_status,assignee,assignee.name,assignee_section,assignee_section.name,assignee_status,completed,completed_at,completed_by,completed_by.name,created_at,created_by,custom_fields,custom_fields.asana_created_field,custom_fields.created_by,custom_fields.created_by.name,custom_fields.currency_code,custom_fields.custom_label,custom_fields.custom_label_position,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.default_access_level,custom_fields.description,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.format,custom_fields.has_notifications_enabled,custom_fields.id_prefix,custom_fields.is_formula_field,custom_fields.is_global_to_workspace,custom_fields.is_value_read_only,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.people_value,custom_fields.people_value.name,custom_fields.precision,custom_fields.privacy_setting,custom_fields.representation_type,custom_fields.resource_subtype,custom_fields.text_value,custom_fields.type,custom_type,custom_type.name,custom_type_status_option,custom_type_status_option.name,dependencies,dependents,due_at,due_on,external,external.data,followers,followers.name,hearted,hearts,hearts.user,hearts.user.name,html_notes,is_rendered_as_separator,liked,likes,likes.user,likes.user.name,memberships,memberships.project,memberships.project.name,memberships.section,memberships.section.name,modified_at,name,notes,num_hearts,num_likes,num_subtasks,parent,parent.created_by,parent.name,parent.resource_subtype,permalink_url,projects,projects.name,resource_subtype,start_at,start_on,tags,tags.name,workspace,workspace.name
```

## Responses

### 200

Successfully retrieved the specified task.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "task",
    "name": "Buy catnip",
    "resource_subtype": "default_task",
    "created_by": {
      "gid": "1111",
      "resource_type": "user"
    },
    "approval_status": "pending",
    "assignee_status": "upcoming",
    "completed": false,
    "completed_at": "2012-02-22T02:06:58.147Z",
    "completed_by": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "created_at": "2012-02-22T02:06:58.147Z",
    "dependencies": [
      {
        "gid": "12345",
        "resource_type": "task"
      }
    ],
    "dependents": [
      {}
    ],
    "due_at": "2019-09-15T02:06:58.147Z",
    "due_on": "2019-09-15",
    "external": {
      "gid": "my_gid",
      "data": "A blob of information"
    },
    "html_notes": "<body>Mittens <em>really</em> likes the stuff from Humboldt.</body>",
    "hearted": true,
    "hearts": [
      {
        "gid": "12345",
        "user": {}
      }
    ],
    "is_rendered_as_separator": false,
    "liked": true,
    "likes": [
      {}
    ],
    "memberships": [
      {
        "project": {
          "gid": "12345",
          "resource_type": "project",
          "name": "Stuff to buy"
        },
        "section": {
          "gid": "12345",
          "resource_type": "section",
          "name": "Next Actions"
        }
      }
    ],
    "modified_at": "2012-02-22T02:06:58.147Z",
    "notes": "Mittens really likes the stuff from Humboldt.",
    "num_hearts": 5,
    "num_likes": 5,
    "num_subtasks": 3,
    "start_at": "2019-09-14T02:06:58.147Z",
    "start_on": "2019-09-14",
    "actual_time_minutes": 200,
    "assignee": {},
    "assignee_section": {},
    "custom_fields": [
      {
        "gid": "12345",
        "resource_type": "custom_field",
        "name": "Status",
        "type": "text",
        "enum_options": [
          {}
        ],
        "enabled": true,
        "representation_type": "number",
        "id_prefix": "ID",
        "is_formula_field": false,
        "date_value": {
          "date": "2024-08-23",
          "date_time": "2024-08-23T22:00:00.000Z"
        },
        "enum_value": {},
        "multi_enum_values": [
          {}
        ],
        "number_value": 5.2,
        "text_value": "Some Value",
        "display_value": "blue",
        "description": "Development team priority",
        "precision": 2,
        "format": "custom",
        "currency_code": "EUR",
        "custom_label": "gold pieces",
        "custom_label_position": "suffix",
        "is_global_to_workspace": true,
        "has_notifications_enabled": true,
        "asana_created_field": "priority",
        "is_value_read_only": false,
        "created_by": {},
        "people_value": [
          {}
        ],
        "privacy_setting": "public_with_guests",
        "default_access_level": "user",
        "resource_subtype": "text"
      }
    ],
    "custom_type": {
      "gid": "12345",
      "resource_type": "custom_type",
      "name": "Bug ticket"
    },
    "custom_type_status_option": {
      "gid": "12345",
      "resource_type": "custom_type_status_option",
      "name": "Solution pending"
    },
    "followers": [
      {}
    ],
    "parent": {},
    "projects": [
      {}
    ],
    "tags": [
      {
        "gid": "59746",
        "name": "Grade A"
      }
    ],
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    },
    "permalink_url": "https://app.asana.com/1/12345/task/123456789"
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

## Security

- **oauth2** (scopes: tasks:read)

