# GET /custom_fields/{custom_field_gid}

**Summary:** Get a custom field

**Description:** <b>Required scope: </b><code>custom_fields:read</code>

Get the complete definition of a custom field’s metadata.

Since custom fields can be defined for one of a number of types, and
these types have different data and behaviors, there are fields that are
relevant to a particular type. For instance, as noted above, enum_options
is only relevant for the enum type and defines the set of choices that
the enum could represent. The examples below show some of these
type-specific custom field definitions.

**Operation ID:** getCustomField

**Tags:** Custom fields

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the complete definition of a custom field’s metadata.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
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

- **oauth2** (scopes: custom_fields:read)


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
    'opt_fields': "asana_created_field,created_by,created_by.name,currency_code,custom_label,custom_label_position,date_value,date_value.date,date_value.date_time,default_access_level,description,display_value,enabled,enum_options,enum_options.color,enum_options.enabled,enum_options.name,enum_value,enum_value.color,enum_value.enabled,enum_value.name,format,has_notifications_enabled,id_prefix,is_formula_field,is_global_to_workspace,is_value_read_only,multi_enum_values,multi_enum_values.color,multi_enum_values.enabled,multi_enum_values.name,name,number_value,people_value,people_value.name,precision,privacy_setting,representation_type,resource_subtype,text_value,type"
};
customFieldsApiInstance.getCustomField(custom_field_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```