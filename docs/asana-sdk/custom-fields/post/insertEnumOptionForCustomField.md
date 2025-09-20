# POST /custom_fields/{custom_field_gid}/enum_options/insert

**Summary:** Reorder a custom field's enum

**Description:** <b>Required scope: </b><code>custom_fields:write</code>

Moves a particular enum option to be either before or after another specified enum option in the custom field.
Locked custom fields can only be reordered by the user who locked the field.

**Operation ID:** insertEnumOptionForCustomField

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
    "enum_option": "97285",
    "before_enum_option": "12345",
    "after_enum_option": "12345"
  }
}
```

## Responses

### 200

Custom field enum option successfully reordered.

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
customFieldsApiInstance.insertEnumOptionForCustomField(custom_field_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```