# POST /tasks/{task_gid}/addProject

**Summary:** Add a project to a task

**Description:** <b>Required scope: </b><code>tasks:write</code>

Adds the task to the specified project, in the optional location
specified. If no location arguments are given, the task will be added to
the end of the project.

`addProject` can also be used to reorder a task within a project or
section that already contains it.

At most one of `insert_before`, `insert_after`, or `section` should be
specified. Inserting into a section in an non-order-dependent way can be
done by specifying section, otherwise, to insert within a section in a
particular place, specify `insert_before` or `insert_after` and a task
within the section to anchor the position of this task.

A task can have at most 20 projects multi-homed to it.

Returns an empty data block.

**Operation ID:** addProjectForTask

**Tags:** Tasks

## Request Body

The project to add the task to.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "project": "13579",
    "insert_after": "124816",
    "insert_before": "432134",
    "section": "987654"
  }
}
```

## Responses

### 200

Successfully added the specified project to the task.

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
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | The project to add the task to.
let task_gid = "321654"; // String | The task to operate on.

tasksApiInstance.addProjectForTask(body, task_gid).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```