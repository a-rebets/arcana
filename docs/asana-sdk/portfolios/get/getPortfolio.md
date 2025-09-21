# GET /portfolios/{portfolio_gid}

**Summary:** Get a portfolio

**Description:** <b>Required scope: </b><code>portfolios:read</code>

<table>
  <tr>
    <th>Field</th>
    <th>Required Scope</th>
  </tr>
  <tr>
    <td><code>custom_field_settings</code></td>
    <td><code>custom_fields:read</code></td>
  </tr>
</table>

Returns the complete portfolio record for a single portfolio.

**Operation ID:** getPortfolio

**Tags:** Portfolios

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| portfolio_gid | string | ✅ | Globally unique identifier for the portfolio. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
archived,color,created_at,created_by,created_by.name,current_status_update,current_status_update.resource_subtype,current_status_update.title,custom_field_settings,custom_field_settings.custom_field,custom_field_settings.custom_field.asana_created_field,custom_field_settings.custom_field.created_by,custom_field_settings.custom_field.created_by.name,custom_field_settings.custom_field.currency_code,custom_field_settings.custom_field.custom_label,custom_field_settings.custom_field.custom_label_position,custom_field_settings.custom_field.date_value,custom_field_settings.custom_field.date_value.date,custom_field_settings.custom_field.date_value.date_time,custom_field_settings.custom_field.default_access_level,custom_field_settings.custom_field.description,custom_field_settings.custom_field.display_value,custom_field_settings.custom_field.enabled,custom_field_settings.custom_field.enum_options,custom_field_settings.custom_field.enum_options.color,custom_field_settings.custom_field.enum_options.enabled,custom_field_settings.custom_field.enum_options.name,custom_field_settings.custom_field.enum_value,custom_field_settings.custom_field.enum_value.color,custom_field_settings.custom_field.enum_value.enabled,custom_field_settings.custom_field.enum_value.name,custom_field_settings.custom_field.format,custom_field_settings.custom_field.has_notifications_enabled,custom_field_settings.custom_field.id_prefix,custom_field_settings.custom_field.is_formula_field,custom_field_settings.custom_field.is_global_to_workspace,custom_field_settings.custom_field.is_value_read_only,custom_field_settings.custom_field.multi_enum_values,custom_field_settings.custom_field.multi_enum_values.color,custom_field_settings.custom_field.multi_enum_values.enabled,custom_field_settings.custom_field.multi_enum_values.name,custom_field_settings.custom_field.name,custom_field_settings.custom_field.number_value,custom_field_settings.custom_field.people_value,custom_field_settings.custom_field.people_value.name,custom_field_settings.custom_field.precision,custom_field_settings.custom_field.privacy_setting,custom_field_settings.custom_field.representation_type,custom_field_settings.custom_field.resource_subtype,custom_field_settings.custom_field.text_value,custom_field_settings.custom_field.type,custom_field_settings.is_important,custom_field_settings.parent,custom_field_settings.parent.name,custom_field_settings.project,custom_field_settings.project.name,custom_fields,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.id_prefix,custom_fields.is_formula_field,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.representation_type,custom_fields.text_value,custom_fields.type,default_access_level,due_on,members,members.name,name,owner,owner.name,permalink_url,privacy_setting,project_templates,project_templates.name,public,start_on,workspace,workspace.name
```

## Responses

### 200

Successfully retrieved the requested portfolio.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "portfolio",
    "name": "Bug Portfolio",
    "archived": false,
    "color": "light-green",
    "created_at": "2012-02-22T02:06:58.147Z",
    "created_by": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "custom_field_settings": [
      {
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
      }
    ],
    "current_status_update": {
      "gid": "12345",
      "resource_type": "status_update",
      "title": "Status Update - Jun 15",
      "resource_subtype": "project_status_update"
    },
    "due_on": "2019-09-15",
    "custom_fields": [
      {}
    ],
    "members": [
      {}
    ],
    "owner": {},
    "start_on": "2019-09-14",
    "workspace": {
      "gid": "12345",
      "resource_type": "workspace",
      "name": "My Company Workspace"
    },
    "permalink_url": "https://app.asana.com/0/resource/123456789/list",
    "public": false,
    "default_access_level": "viewer",
    "privacy_setting": "members_only",
    "project_templates": [
      {
        "gid": "12345",
        "resource_type": "project_template",
        "name": "Packing list"
      }
    ]
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

- **oauth2** (scopes: portfolios:read)

