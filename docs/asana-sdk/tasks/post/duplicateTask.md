# POST /tasks/{task_gid}/duplicate

**Summary:** Duplicate a task

**Description:** <b>Required scope: </b><code>tasks:write</code>

Creates and returns a job that will asynchronously handle the duplication.

**Operation ID:** duplicateTask

**Tags:** Tasks

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Request Body

Describes the duplicate's name and the fields that will be duplicated.

**Required:** ✅ Required

### Content Types

#### application/json

**Example:**

```json
{
  "data": {
    "name": "New Task Name",
    "include": [
      "notes,assignee,subtasks,attachments,tags,followers,projects,dates,dependencies,parent"
    ]
  }
}
```

## Responses

### 201

Successfully created the job to handle duplication.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "job",
    "resource_subtype": "duplicate_task",
    "status": "not_started",
    "new_project": {
      "gid": "12345",
      "resource_type": "project",
      "name": "Stuff to buy"
    },
    "new_task": {
      "gid": "12345",
      "resource_type": "task",
      "name": "Bug Task",
      "resource_subtype": "default_task",
      "created_by": {
        "gid": "1111",
        "resource_type": "user"
      }
    },
    "new_project_template": {
      "gid": "12345",
      "resource_type": "project_template",
      "name": "Packing list"
    },
    "new_graph_export": {
      "gid": "12345",
      "resource_type": "graph_export",
      "created_at": "2024-01-01T00:00:00Z",
      "download_url": "https://asana-export-us-east-1.s3.us-east-1.amazonaws.com/2563645399633793/domain_export/7588024658887731/download/ domain_export_2563645399633793_7588024658887731_2023018-201726.json.gz?X-Amz-Algorithm=AWS4-HMAC-SHA256& X-Amz-Content-Sha256=xxxxxxxx&X-Amz-Date=xxxxxxxx&X-Amz-Expires=300&X-Amz-Security-Token=xxxxxxxx& X-Amz-Signature=xxxxxxxx&X-Amz-SignedHeaders=host&x-id=GetObject#_=_",
      "completed_at": "2024-01-01T00:00:00Z"
    },
    "new_resource_export": {
      "gid": "12345",
      "resource_type": "export_request",
      "created_at": "2024-01-01T00:00:00Z",
      "download_url": "https://asana-export-us-east-1.s3.us-east-1.amazonaws.com/2563645399633793/object_export/7588024658887731/download/ object_export_2563645399633793_7588024658887731_2023018-201726.jsonl.gz?X-Amz-Algorithm=AWS4-HMAC-SHA256& X-Amz-Credential=xxxxxxxx&X-Amz-Date=xxxxxxxx&X-Amz-Expires=300&X-Amz-Security-Token=xxxxxxxx& X-Amz-Signature=xxxxxxxx&X-Amz-SignedHeaders=host",
      "completed_at": "2024-01-01T00:00:00Z"
    }
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

- **oauth2** (scopes: tasks:write)


---

## Usage with the Node SDK

```javascript
const Asana = require('asana');

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<YOUR_ACCESS_TOKEN>';

let tasksApiInstance = new Asana.TasksApi();
let body = {"data": {"<PARAM_1>": "<VALUE_1>", "<PARAM_2>": "<VALUE_2>",}}; // Object | Describes the duplicate's name and the fields that will be duplicated.
let task_gid = "321654"; // String | The task to operate on.
let opts = { 
    'opt_fields': "new_graph_export,new_graph_export.completed_at,new_graph_export.created_at,new_graph_export.download_url,new_project,new_project.name,new_project_template,new_project_template.name,new_resource_export,new_resource_export.completed_at,new_resource_export.created_at,new_resource_export.download_url,new_task,new_task.created_by,new_task.name,new_task.resource_subtype,resource_subtype,status"
};
tasksApiInstance.duplicateTask(body, task_gid, opts).then((result) => {
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));
}, (error) => {
    console.error(error.response.body);
});

```