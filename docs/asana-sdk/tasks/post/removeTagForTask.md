# POST /tasks/{task_gid}/removeTag

**Summary:** Remove a tag from a task

**Description:** <b>Required scope: </b><code>tasks:write</code>

Removes a tag from a task. Returns an empty data block.

**Operation ID:** removeTagForTask

**Tags:** Tasks

## Request Body

The tag to remove from the task.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "tag": "13579"
  }
}
```

## Responses

### 200

Successfully removed the specified tag from the task.

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

## Security

- **oauth2** (scopes: tasks:write)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let tasksApiInstance = new Asana.TasksApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The tag to remove from the task.
let task_gid = "321654"; // String | The task to operate on.

tasksApiInstance.removeTagForTask(body, task_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```