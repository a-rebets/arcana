# POST /tasks/{task_gid}/removeDependents

**Summary:** Unlink dependents from a task

**Description:** <b>Required scope: </b><code>tasks:write</code>

Unlinks a set of dependents from this task.

**Operation ID:** removeDependentsForTask

**Tags:** Tasks

## Request Body

The list of tasks to remove as dependents.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "dependents": [
      "\"string\""
    ]
  }
}
```

## Responses

### 200

Successfully unlinked the specified tasks as dependents.

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

### 402
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
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The list of tasks to remove as dependents.
let task_gid = "321654"; // String | The task to operate on.

tasksApiInstance.removeDependentsForTask(body, task_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```