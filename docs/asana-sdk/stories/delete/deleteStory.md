# DELETE /stories/{story_gid}

**Summary:** Delete a story

**Description:** Deletes a story. A user can only delete stories they have created.

Returns an empty data record.

**Operation ID:** deleteStory

**Tags:** Stories

## Responses

### 200

Successfully deleted the specified story.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {}
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

let storiesApiInstance = new Asana.StoriesApi();
let story_gid = "35678"; // String | Globally unique identifier for the story.

storiesApiInstance.deleteStory(story_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```