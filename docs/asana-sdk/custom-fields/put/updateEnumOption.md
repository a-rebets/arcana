# PUT /enum_options/{enum_option_gid}

**Summary:** Update an enum option

**Description:** <b>Required scope: </b><code>custom_fields:write</code>

Updates an existing enum option. Enum custom fields require at least one enabled enum option.
Locked custom fields can only be updated by the user who locked the field.
Returns the full record of the updated enum option.

**Operation ID:** updateEnumOption

**Tags:** Custom fields

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

The enum option object to update

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
    "color": "blue"
  }
}
```

## Responses

### 200

Successfully updated the specified custom field enum.

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
let enum_option_gid = "124578"; // String | Globally unique identifier for the enum option.
let opts = { 
    'body': {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}, 
    'opt_fields': "color,enabled,name"
};
customFieldsApiInstance.updateEnumOption(enum_option_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```