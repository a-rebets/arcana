# GET /workspaces/{workspace_gid}/tasks/custom_id/{custom_id}

**Summary:** Get a task for a given custom ID

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

Returns a task given a custom ID shortcode.

**Operation ID:** getTaskForCustomID

**Tags:** Tasks

## Responses

### 200

Successfully retrieved task for given custom ID.

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

- **oauth2** (scopes: tasks:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let tasksApiInstance = new Asana.TasksApi();
let workspace_gid = "12345"; // String | Globally unique identifier for the workspace or organization.
let custom_id = "EX-1"; // String | Generated custom ID for a task.

tasksApiInstance.getTaskForCustomID(workspace_gid, custom_id).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```