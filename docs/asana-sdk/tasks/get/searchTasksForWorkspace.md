# GET /workspaces/{workspace_gid}/tasks/search

**Summary:** Search tasks in a workspace

**Description:** <b>Required scope: </b><code>tasks:read</code>

To mirror the functionality of the Asana web app's advanced search feature, the Asana API has a task search endpoint that allows you to build complex filters to find and retrieve the exact data you need.
#### Premium access
Like the Asana web product's advance search feature, this search endpoint will only be available to premium Asana users. A user is premium if any of the following is true:

- The workspace in which the search is being performed is a premium workspace - The user is a member of a premium team inside the workspace

Even if a user is only a member of a premium team inside a non-premium workspace, search will allow them to find data anywhere in the workspace, not just inside the premium team. Making a search request using credentials of a non-premium user will result in a `402 Payment Required` error.
#### Pagination
Search results are not stable; repeating the same query multiple times may return the data in a different order, even if the data do not change. Because of this, the traditional [pagination](https://developers.asana.com/docs/#pagination) available elsewhere in the Asana API is not available here. However, you can paginate manually by sorting the search results by their creation time and then modifying each subsequent query to exclude data you have already seen. Page sizes are limited to a maximum of 100 items, and can be specified by the `limit` query parameter.
#### Eventual consistency
Changes in Asana (regardless of whether they’re made though the web product or the API) are forwarded to our search infrastructure to be indexed. This process can take between 10 and 60 seconds to complete under normal operation, and longer during some production incidents. Making a change to a task that would alter its presence in a particular search query will not be reflected immediately. This is also true of the advanced search feature in the web product.
#### Rate limits
You may receive a `429 Too Many Requests` response if you hit any of our [rate limits](https://developers.asana.com/docs/#rate-limits).
#### Custom field parameters
| Parameter name | Custom field type | Accepted type |
|---|---|---|
| custom_fields.{gid}.is_set | All | Boolean |
| custom_fields.{gid}.value | Text | String |
| custom_fields.{gid}.value | Number | Number |
| custom_fields.{gid}.value | Enum | Enum option ID |
| custom_fields.{gid}.starts_with | Text only | String |
| custom_fields.{gid}.ends_with | Text only | String |
| custom_fields.{gid}.contains | Text only | String |
| custom_fields.{gid}.less_than | Number only | Number |
| custom_fields.{gid}.greater_than | Number only | Number |


For example, if the gid of the custom field is 12345, these query parameter to find tasks where it is set would be `custom_fields.12345.is_set=true`. To match an exact value for an enum custom field, use the gid of the desired enum option and not the name of the enum option: `custom_fields.12345.value=67890`.

**Not Supported**: searching for multiple exact matches of a custom field, searching for multi-enum custom field

*Note: If you specify `projects.any` and `sections.any`, you will receive tasks for the project **and** tasks for the section. If you're looking for only tasks in a section, omit the `projects.any` from the request.*

**Operation ID:** searchTasksForWorkspace

**Tags:** Tasks

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the section's tasks.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": [
    {
      "gid": "12345",
      "resource_type": "task",
      "name": "Bug Task",
      "resource_subtype": "default_task",
      "created_by": {
        "gid": "1111",
        "resource_type": "user"
      }
    }
  ]
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
let opts = { 
    'text': "Bug", 
    'resource_subtype': "milestone", 
    'assignee.any': "12345,23456,34567", 
    'assignee.not': "12345,23456,34567", 
    'portfolios.any': "12345,23456,34567", 
    'projects.any': "12345,23456,34567", 
    'projects.not': "12345,23456,34567", 
    'projects.all': "12345,23456,34567", 
    'sections.any': "12345,23456,34567", 
    'sections.not': "12345,23456,34567", 
    'sections.all': "12345,23456,34567", 
    'tags.any': "12345,23456,34567", 
    'tags.not': "12345,23456,34567", 
    'tags.all': "12345,23456,34567", 
    'teams.any': "12345,23456,34567", 
    'followers.any': "12345,23456,34567", 
    'followers.not': "12345,23456,34567", 
    'created_by.any': "12345,23456,34567", 
    'created_by.not': "12345,23456,34567", 
    'assigned_by.any': "12345,23456,34567", 
    'assigned_by.not': "12345,23456,34567", 
    'liked_by.not': "12345,23456,34567", 
    'commented_on_by.not': "12345,23456,34567", 
    'due_on.before': "2019-09-15", 
    'due_on.after': "2019-09-15", 
    'due_on': "2019-09-15", 
    'due_at.before': "2019-04-15T01:01:46.055Z", 
    'due_at.after': "2019-04-15T01:01:46.055Z", 
    'start_on.before': "2019-09-15", 
    'start_on.after': "2019-09-15", 
    'start_on': "2019-09-15", 
    'created_on.before': "2019-09-15", 
    'created_on.after': "2019-09-15", 
    'created_on': "2019-09-15", 
    'created_at.before': "2019-04-15T01:01:46.055Z", 
    'created_at.after': "2019-04-15T01:01:46.055Z", 
    'completed_on.before': "2019-09-15", 
    'completed_on.after': "2019-09-15", 
    'completed_on': "2019-09-15", 
    'completed_at.before': "2019-04-15T01:01:46.055Z", 
    'completed_at.after': "2019-04-15T01:01:46.055Z", 
    'modified_on.before': "2019-09-15", 
    'modified_on.after': "2019-09-15", 
    'modified_on': "2019-09-15", 
    'modified_at.before': "2019-04-15T01:01:46.055Z", 
    'modified_at.after': "2019-04-15T01:01:46.055Z", 
    'is_blocking': false, 
    'is_blocked': false, 
    'has_attachment': false, 
    'completed': false, 
    'is_subtask': false, 
    'sort_by': "modified_at", 
    'sort_ascending': false, 
    'opt_fields': "actual_time_minutes,approval_status,assignee,assignee.name,assignee_section,assignee_section.name,assignee_status,completed,completed_at,completed_by,completed_by.name,created_at,created_by,custom_fields,custom_fields.asana_created_field,custom_fields.created_by,custom_fields.created_by.name,custom_fields.currency_code,custom_fields.custom_label,custom_fields.custom_label_position,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.default_access_level,custom_fields.description,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.format,custom_fields.has_notifications_enabled,custom_fields.id_prefix,custom_fields.is_formula_field,custom_fields.is_global_to_workspace,custom_fields.is_value_read_only,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.people_value,custom_fields.people_value.name,custom_fields.precision,custom_fields.privacy_setting,custom_fields.representation_type,custom_fields.resource_subtype,custom_fields.text_value,custom_fields.type,custom_type,custom_type.name,custom_type_status_option,custom_type_status_option.name,dependencies,dependents,due_at,due_on,external,external.data,followers,followers.name,hearted,hearts,hearts.user,hearts.user.name,html_notes,is_rendered_as_separator,liked,likes,likes.user,likes.user.name,memberships,memberships.project,memberships.project.name,memberships.section,memberships.section.name,modified_at,name,notes,num_hearts,num_likes,num_subtasks,parent,parent.created_by,parent.name,parent.resource_subtype,permalink_url,projects,projects.name,resource_subtype,start_at,start_on,tags,tags.name,workspace,workspace.name"
};
// Custom fields query
opts['custom_fields.123.is_set'] = true; // Boolean | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
opts['custom_fields.123.value'] = '456'; // String, Number, Enum option ID | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
opts['custom_fields.123.starts_with'] = 'start'; // String | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
opts['custom_fields.123.ends_with'] = 'end'; // String | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
opts['custom_fields.123.contains'] = 'first'; // String | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
opts['custom_fields.123.less_than'] = 10; // Number | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
opts['custom_fields.123.greater_than'] = 100; // Number | Replace "123" with <YOUR_CUSTOM_FIELD_GID>. NOTE: searching for multiple exact matches of a custom field, searching for multi-enum custom field
tasksApiInstance.searchTasksForWorkspace(workspace_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```