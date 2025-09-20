# GET /stories/{story_gid}

**Summary:** Get a story

**Description:** <b>Required scope: </b><code>stories:read</code>

<table>
  <tr>
    <th>Field</th>
    <th>Required Scope</th>
  </tr>
  <tr>
    <td><code>previews</code></td>
    <td><code>attachments:read</code></td>
  </tr>
  <tr>
    <td><code>attachments</code></td>
    <td><code>attachments:read</code></td>
  </tr>
</table>

Returns the full record for a single story.

**Operation ID:** getStory

**Tags:** Stories

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Responses

### 200

Successfully retrieved the specified story.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "story",
    "created_at": "2024-01-01T00:00:00Z",
    "resource_subtype": "comment_added",
    "text": "This is a comment.",
    "html_text": "<body>This is a comment.</body>",
    "is_pinned": false,
    "sticker_name": "green_checkmark",
    "created_by": {
      "gid": "12345",
      "resource_type": "user",
      "name": "Greg Sanchez"
    },
    "type": "comment",
    "is_editable": false,
    "is_edited": false,
    "hearted": false,
    "hearts": [
      {
        "gid": "12345",
        "user": {}
      }
    ],
    "num_hearts": 5,
    "liked": false,
    "likes": [
      {}
    ],
    "num_likes": 5,
    "reaction_summary": [
      {
        "emoji_base": "👎",
        "variant": "👎🏼",
        "count": 1,
        "reacted": false
      }
    ],
    "previews": [
      {
        "fallback": "Greg: Great! I like this idea.\\n\\nhttps//a_company.slack.com/archives/ABCDEFG/12345678",
        "footer": "Mar 17, 2019 1:25 PM",
        "header": "Asana for Slack",
        "header_link": "https://asana.comn/apps/slack",
        "html_text": "<body>Great! I like this idea.</body>",
        "text": "Great! I like this idea.",
        "title": "Greg",
        "title_link": "https://asana.slack.com/archives/ABCDEFG/12345678"
      }
    ],
    "old_name": "This was the old name",
    "new_name": "This is the new name",
    "old_dates": {
      "start_on": "2024-01-01",
      "due_at": "2024-01-01T00:00:00Z",
      "due_on": "2024-01-01"
    },
    "new_dates": {},
    "old_resource_subtype": "default_task",
    "new_resource_subtype": "milestone",
    "story": {
      "gid": "12345",
      "resource_type": "story",
      "created_at": "2024-01-01T00:00:00Z",
      "created_by": {},
      "resource_subtype": "comment_added",
      "text": "marked today"
    },
    "assignee": {},
    "follower": {},
    "old_section": {
      "gid": "12345",
      "resource_type": "section",
      "name": "Next Actions"
    },
    "new_section": {},
    "task": {
      "gid": "12345",
      "resource_type": "task",
      "name": "Bug Task",
      "resource_subtype": "default_task",
      "created_by": {
        "gid": "1111",
        "resource_type": "user"
      }
    },
    "project": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
    },
    "tag": {
      "gid": "12345",
      "resource_type": "tag",
      "name": "Stuff to buy"
    },
    "custom_field": {
      "gid": "12345",
      "resource_type": "custom_field",
      "name": "Status",
      "type": "text",
      "enum_options": [
        {
          "gid": "12345",
          "resource_type": "enum_option",
          "name": "Low",
          "enabled": true,
          "color": "blue"
        }
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
      "display_value": "blue"
    },
    "old_text_value": "This was the old text",
    "new_text_value": "This is the new text",
    "old_number_value": 1,
    "new_number_value": 2,
    "old_enum_value": {},
    "new_enum_value": {},
    "old_date_value": {},
    "new_date_value": {},
    "old_people_value": [
      {}
    ],
    "new_people_value": [
      {}
    ],
    "old_multi_enum_values": [
      {}
    ],
    "new_multi_enum_values": [
      {}
    ],
    "new_approval_status": "approved",
    "old_approval_status": "pending",
    "duplicate_of": {},
    "duplicated_from": {},
    "dependency": {},
    "source": "web",
    "target": {}
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

- **oauth2** (scopes: stories:read)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let storiesApiInstance = new Asana.StoriesApi();
let story_gid = "35678"; // String | Globally unique identifier for the story.
let opts = { 
    'opt_fields': "assignee,assignee.name,created_at,created_by,created_by.name,custom_field,custom_field.date_value,custom_field.date_value.date,custom_field.date_value.date_time,custom_field.display_value,custom_field.enabled,custom_field.enum_options,custom_field.enum_options.color,custom_field.enum_options.enabled,custom_field.enum_options.name,custom_field.enum_value,custom_field.enum_value.color,custom_field.enum_value.enabled,custom_field.enum_value.name,custom_field.id_prefix,custom_field.is_formula_field,custom_field.multi_enum_values,custom_field.multi_enum_values.color,custom_field.multi_enum_values.enabled,custom_field.multi_enum_values.name,custom_field.name,custom_field.number_value,custom_field.representation_type,custom_field.text_value,custom_field.type,dependency,dependency.created_by,dependency.name,dependency.resource_subtype,duplicate_of,duplicate_of.created_by,duplicate_of.name,duplicate_of.resource_subtype,duplicated_from,duplicated_from.created_by,duplicated_from.name,duplicated_from.resource_subtype,follower,follower.name,hearted,hearts,hearts.user,hearts.user.name,html_text,is_editable,is_edited,is_pinned,liked,likes,likes.user,likes.user.name,new_approval_status,new_date_value,new_dates,new_dates.due_at,new_dates.due_on,new_dates.start_on,new_enum_value,new_enum_value.color,new_enum_value.enabled,new_enum_value.name,new_multi_enum_values,new_multi_enum_values.color,new_multi_enum_values.enabled,new_multi_enum_values.name,new_name,new_number_value,new_people_value,new_people_value.name,new_resource_subtype,new_section,new_section.name,new_text_value,num_hearts,num_likes,old_approval_status,old_date_value,old_dates,old_dates.due_at,old_dates.due_on,old_dates.start_on,old_enum_value,old_enum_value.color,old_enum_value.enabled,old_enum_value.name,old_multi_enum_values,old_multi_enum_values.color,old_multi_enum_values.enabled,old_multi_enum_values.name,old_name,old_number_value,old_people_value,old_people_value.name,old_resource_subtype,old_section,old_section.name,old_text_value,previews,previews.fallback,previews.footer,previews.header,previews.header_link,previews.html_text,previews.text,previews.title,previews.title_link,project,project.name,resource_subtype,source,sticker_name,story,story.created_at,story.created_by,story.created_by.name,story.resource_subtype,story.text,tag,tag.name,target,target.created_by,target.name,target.resource_subtype,task,task.created_by,task.name,task.resource_subtype,text,type"
};
storiesApiInstance.getStory(story_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```