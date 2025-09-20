# POST /projects/{project_gid}/addCustomFieldSetting

**Summary:** Add a custom field to a project

**Description:** <b>Required scope: </b><code>projects:write</code>

Custom fields are associated with projects by way of custom field settings.  This method creates a setting for the project.

**Operation ID:** addCustomFieldSettingForProject

**Tags:** Projects

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

Information about the custom field setting.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "custom_field": "14916",
    "is_important": true,
    "insert_before": "1331",
    "insert_after": "1331"
  }
}
```

## Responses

### 200

Successfully added the custom field to the project.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "custom_field_setting",
    "project": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
    },
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
      "created_by": {
        "gid": "12345",
        "resource_type": "user",
        "name": "Greg Sanchez"
      },
      "people_value": [
        {}
      ],
      "privacy_setting": "public_with_guests",
      "default_access_level": "admin",
      "resource_subtype": "text"
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

## Security

- **oauth2** (scopes: projects:write)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let projectsApiInstance = new Asana.ProjectsApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | Information about the custom field setting.
let project_gid = "1331"; // String | Globally unique identifier for the project.
let opts = { 
    'opt_fields': "custom_field,custom_field.asana_created_field,custom_field.created_by,custom_field.created_by.name,custom_field.currency_code,custom_field.custom_label,custom_field.custom_label_position,custom_field.date_value,custom_field.date_value.date,custom_field.date_value.date_time,custom_field.default_access_level,custom_field.description,custom_field.display_value,custom_field.enabled,custom_field.enum_options,custom_field.enum_options.color,custom_field.enum_options.enabled,custom_field.enum_options.name,custom_field.enum_value,custom_field.enum_value.color,custom_field.enum_value.enabled,custom_field.enum_value.name,custom_field.format,custom_field.has_notifications_enabled,custom_field.id_prefix,custom_field.is_formula_field,custom_field.is_global_to_workspace,custom_field.is_value_read_only,custom_field.multi_enum_values,custom_field.multi_enum_values.color,custom_field.multi_enum_values.enabled,custom_field.multi_enum_values.name,custom_field.name,custom_field.number_value,custom_field.people_value,custom_field.people_value.name,custom_field.precision,custom_field.privacy_setting,custom_field.representation_type,custom_field.resource_subtype,custom_field.text_value,custom_field.type,is_important,parent,parent.name,project,project.name"
};
projectsApiInstance.addCustomFieldSettingForProject(body, project_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```