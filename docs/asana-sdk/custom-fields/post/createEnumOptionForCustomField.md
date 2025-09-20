# POST /custom_fields/{custom_field_gid}/enum_options

**Summary:** Create an enum option

**Description:** <b>Required scope: </b><code>custom_fields:write</code>

Creates an enum option and adds it to this custom field’s list of enum options. A custom field can have at most 500 enum options (including disabled options). By default new enum options are inserted at the end of a custom field’s list.
Locked custom fields can only have enum options added by the user who locked the field.
Returns the full record of the newly created enum option.

**Operation ID:** createEnumOptionForCustomField

**Tags:** Custom fields

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The enum option object to create.

**Required:** ❌ Optional

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "enum_option",
    "name": "Low",
    "enabled": true,
    "color": "blue",
    "insert_before": "12345",
    "insert_after": "12345"
  }
}
```

## Responses

### 201

Custom field enum option successfully created.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "enum_option",
    "name": "Low",
    "enabled": true,
    "color": "blue"
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

- **oauth2** (scopes: custom_fields:write)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let customFieldsApiInstance = new Asana.CustomFieldsApi();
let custom_field_gid = "12345"; // String | Globally unique identifier for the custom field.
let opts = { 
    'body': {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}, 
    'opt_fields': "color,enabled,name"
};
customFieldsApiInstance.createEnumOptionForCustomField(custom_field_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```