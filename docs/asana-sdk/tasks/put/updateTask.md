# PUT /tasks/{task_gid}

**Summary:** Update a task

**Description:** <b>Required scope: </b><code>tasks:write</code>

A specific, existing task can be updated by making a PUT request on the
URL for that task. Only the fields provided in the `data` block will be
updated; any unspecified fields will remain unchanged.

When using this method, it is best to specify only those fields you wish
to change, or else you may overwrite changes made by another user since
you last retrieved the task.

Returns the complete updated task record.

**Operation ID:** updateTask

**Tags:** Tasks

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The task to update.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

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
    "assignee_status": "today",
    "completed": false,
    "completed_at": "2024-01-01T00:00:00Z",
    "completed_by": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "dependencies": [
      {
        "gid": "12345",
        "resource_type": "task"
      }
    ],
    "dependents": [
      {}
    ],
    "due_at": "2024-01-01T00:00:00Z",
    "due_on": "2024-01-01",
    "external": {
      "gid": "1234",
      "data": "A blob of information."
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
    "modified_at": "2024-01-01T00:00:00Z",
    "notes": "Mittens really likes the stuff from Humboldt.",
    "num_hearts": 5,
    "num_likes": 5,
    "num_subtasks": 3,
    "start_at": "2024-01-01T00:00:00Z",
    "start_on": "2024-01-01",
    "actual_time_minutes": 200,
    "assignee": "12345",
    "assignee_section": "12345",
    "custom_fields": {},
    "followers": [
      "\"Gid of a user.\""
    ],
    "parent": "12345",
    "projects": [
      "\"Gid of a project.\""
    ],
    "tags": [
      "\"Gid of a tag.\""
    ],
    "workspace": "12345",
    "custom_type": "12345",
    "custom_type_status_option": "12345"
  }
}
```

## Responses

### 200

Successfully updated the specified task.

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
    "assignee_status": "today",
    "completed": false,
    "completed_at": "2024-01-01T00:00:00Z",
    "completed_by": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "dependencies": [
      {
        "gid": "12345",
        "resource_type": "task"
      }
    ],
    "dependents": [
      {}
    ],
    "due_at": "2024-01-01T00:00:00Z",
    "due_on": "2024-01-01",
    "external": {
      "gid": "1234",
      "data": "A blob of information."
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
    "modified_at": "2024-01-01T00:00:00Z",
    "notes": "Mittens really likes the stuff from Humboldt.",
    "num_hearts": 5,
    "num_likes": 5,
    "num_subtasks": 3,
    "start_at": "2024-01-01T00:00:00Z",
    "start_on": "2024-01-01",
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
        "representation_type": "text",
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
        "format": "currency",
        "currency_code": "EUR",
        "custom_label": "gold pieces",
        "custom_label_position": "prefix",
        "is_global_to_workspace": true,
        "has_notifications_enabled": true,
        "asana_created_field": "a_v_requirements",
        "is_value_read_only": false,
        "created_by": {},
        "people_value": [
          {}
        ],
        "privacy_setting": "public_with_guests",
        "default_access_level": "admin",
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
        "gid": "12345",
        "resource_type": "tag",
        "name": "Stuff to buy"
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

- **oauth2** (scopes: tasks:write)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let tasksApiInstance = new Asana.TasksApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The task to update.
let task_gid = "321654"; // String | The task to operate on.
let opts = { 
    'opt_fields': "actual_time_minutes,approval_status,assignee,assignee.name,assignee_section,assignee_section.name,assignee_status,completed,completed_at,completed_by,completed_by.name,created_at,created_by,custom_fields,custom_fields.asana_created_field,custom_fields.created_by,custom_fields.created_by.name,custom_fields.currency_code,custom_fields.custom_label,custom_fields.custom_label_position,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.default_access_level,custom_fields.description,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.format,custom_fields.has_notifications_enabled,custom_fields.id_prefix,custom_fields.is_formula_field,custom_fields.is_global_to_workspace,custom_fields.is_value_read_only,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.people_value,custom_fields.people_value.name,custom_fields.precision,custom_fields.privacy_setting,custom_fields.representation_type,custom_fields.resource_subtype,custom_fields.text_value,custom_fields.type,custom_type,custom_type.name,custom_type_status_option,custom_type_status_option.name,dependencies,dependents,due_at,due_on,external,external.data,followers,followers.name,hearted,hearts,hearts.user,hearts.user.name,html_notes,is_rendered_as_separator,liked,likes,likes.user,likes.user.name,memberships,memberships.project,memberships.project.name,memberships.section,memberships.section.name,modified_at,name,notes,num_hearts,num_likes,num_subtasks,parent,parent.created_by,parent.name,parent.resource_subtype,permalink_url,projects,projects.name,resource_subtype,start_at,start_on,tags,tags.name,workspace,workspace.name"
};
tasksApiInstance.updateTask(body, task_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```