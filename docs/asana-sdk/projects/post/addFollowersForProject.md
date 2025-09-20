# POST /projects/{project_gid}/addFollowers

**Summary:** Add followers to a project

**Description:** Adds the specified list of users as followers to the project. Followers are a subset of members who have opted in to receive "tasks added" notifications for a project. Therefore, if the users are not already members of the project, they will also become members as a result of this operation.
Returns the updated project record.

**Operation ID:** addFollowersForProject

**Tags:** Projects

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

Information about the followers being added.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "followers": "521621,621373"
  }
}
```

## Responses

### 200

Successfully added followers to the project.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "project",
    "name": "Stuff to buy",
    "archived": false,
    "color": "dark-pink",
    "created_at": "2024-01-01T00:00:00Z",
    "current_status": {
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
      "created_at": "2024-01-01T00:00:00Z",
      "created_by": {},
      "modified_at": "2024-01-01T00:00:00Z"
    },
    "current_status_update": {
      "gid": "12345",
      "resource_type": "status_update",
      "title": "Status Update - Jun 15",
      "resource_subtype": "project_status_update"
    },
    "custom_field_settings": [
      {
        "gid": "12345",
        "resource_type": "custom_field_setting",
        "project": {},
        "is_important": false,
        "parent": {},
        "custom_field": {
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
      }
    ],
    "default_view": "list",
    "due_date": "2024-01-01",
    "due_on": "2024-01-01",
    "html_notes": "<body>These are things we need to purchase.</body>",
    "members": [
      {}
    ],
    "modified_at": "2024-01-01T00:00:00Z",
    "notes": "These are things we need to purchase.",
    "public": false,
    "privacy_setting": "public_to_workspace",
    "start_on": "2024-01-01",
    "default_access_level": "admin",
    "minimum_access_level_for_customization": "admin",
    "minimum_access_level_for_sharing": "admin",
    "custom_fields": [
      {}
    ],
    "completed": false,
    "completed_at": "2024-01-01T00:00:00Z",
    "completed_by": {},
    "followers": [
      {}
    ],
    "owner": {},
    "team": {
      "gid": "12345",
      "resource_type": "team",
      "name": "Marketing"
    },
    "icon": "list",
    "permalink_url": "https://app.asana.com/1/12345/project/123456789",
    "project_brief": {
      "gid": "12345",
      "resource_type": "project_brief"
    },
    "created_from_template": {
      "gid": "12345",
      "resource_type": "project_template",
      "name": "Packing list"
    },
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
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

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let projectsApiInstance = new Asana.ProjectsApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | Information about the followers being added.
let project_gid = "1331"; // String | Globally unique identifier for the project.
let opts = { 
    'opt_fields': "archived,color,completed,completed_at,completed_by,completed_by.name,created_at,created_from_template,created_from_template.name,current_status,current_status.author,current_status.author.name,current_status.color,current_status.created_at,current_status.created_by,current_status.created_by.name,current_status.html_text,current_status.modified_at,current_status.text,current_status.title,current_status_update,current_status_update.resource_subtype,current_status_update.title,custom_field_settings,custom_field_settings.custom_field,custom_field_settings.custom_field.asana_created_field,custom_field_settings.custom_field.created_by,custom_field_settings.custom_field.created_by.name,custom_field_settings.custom_field.currency_code,custom_field_settings.custom_field.custom_label,custom_field_settings.custom_field.custom_label_position,custom_field_settings.custom_field.date_value,custom_field_settings.custom_field.date_value.date,custom_field_settings.custom_field.date_value.date_time,custom_field_settings.custom_field.default_access_level,custom_field_settings.custom_field.description,custom_field_settings.custom_field.display_value,custom_field_settings.custom_field.enabled,custom_field_settings.custom_field.enum_options,custom_field_settings.custom_field.enum_options.color,custom_field_settings.custom_field.enum_options.enabled,custom_field_settings.custom_field.enum_options.name,custom_field_settings.custom_field.enum_value,custom_field_settings.custom_field.enum_value.color,custom_field_settings.custom_field.enum_value.enabled,custom_field_settings.custom_field.enum_value.name,custom_field_settings.custom_field.format,custom_field_settings.custom_field.has_notifications_enabled,custom_field_settings.custom_field.id_prefix,custom_field_settings.custom_field.is_formula_field,custom_field_settings.custom_field.is_global_to_workspace,custom_field_settings.custom_field.is_value_read_only,custom_field_settings.custom_field.multi_enum_values,custom_field_settings.custom_field.multi_enum_values.color,custom_field_settings.custom_field.multi_enum_values.enabled,custom_field_settings.custom_field.multi_enum_values.name,custom_field_settings.custom_field.name,custom_field_settings.custom_field.number_value,custom_field_settings.custom_field.people_value,custom_field_settings.custom_field.people_value.name,custom_field_settings.custom_field.precision,custom_field_settings.custom_field.privacy_setting,custom_field_settings.custom_field.representation_type,custom_field_settings.custom_field.resource_subtype,custom_field_settings.custom_field.text_value,custom_field_settings.custom_field.type,custom_field_settings.is_important,custom_field_settings.parent,custom_field_settings.parent.name,custom_field_settings.project,custom_field_settings.project.name,custom_fields,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.id_prefix,custom_fields.is_formula_field,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.representation_type,custom_fields.text_value,custom_fields.type,default_access_level,default_view,due_date,due_on,followers,followers.name,html_notes,icon,members,members.name,minimum_access_level_for_customization,minimum_access_level_for_sharing,modified_at,name,notes,owner,permalink_url,privacy_setting,project_brief,public,start_on,team,team.name,workspace,workspace.name"
};
projectsApiInstance.addFollowersForProject(body, project_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```