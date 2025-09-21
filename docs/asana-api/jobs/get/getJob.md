# GET /jobs/{job_gid}

**Summary:** Get a job by id

**Description:** Returns the full record for a job.

**Operation ID:** getJob

**Tags:** Jobs

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| job_gid | string | ✅ | Globally unique identifier for the job. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
new_graph_export,new_graph_export.completed_at,new_graph_export.created_at,new_graph_export.download_url,new_project,new_project.name,new_project_template,new_project_template.name,new_resource_export,new_resource_export.completed_at,new_resource_export.created_at,new_resource_export.download_url,new_task,new_task.created_by,new_task.name,new_task.resource_subtype,new_task_template,new_task_template.name,resource_subtype,status
```

## Responses

### 200

Successfully retrieved Job.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "job",
    "resource_subtype": "duplicate_task",
    "status": "in_progress",
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
      "created_at": "2012-02-22T02:06:58.147Z",
      "download_url": "https://asana-export-us-east-1.s3.us-east-1.amazonaws.com/2563645399633793/domain_export/7588024658887731/download/ domain_export_2563645399633793_7588024658887731_2023018-201726.json.gz?X-Amz-Algorithm=AWS4-HMAC-SHA256& X-Amz-Content-Sha256=xxxxxxxx&X-Amz-Date=xxxxxxxx&X-Amz-Expires=300&X-Amz-Security-Token=xxxxxxxx& X-Amz-Signature=xxxxxxxx&X-Amz-SignedHeaders=host&x-id=GetObject#_=_",
      "completed_at": "2012-02-22T03:06:58.147Z"
    },
    "new_resource_export": {
      "gid": "12345",
      "resource_type": "export_request",
      "created_at": "2012-02-22T02:06:58.147Z",
      "download_url": "https://asana-export-us-east-1.s3.us-east-1.amazonaws.com/2563645399633793/object_export/7588024658887731/download/ object_export_2563645399633793_7588024658887731_2023018-201726.jsonl.gz?X-Amz-Algorithm=AWS4-HMAC-SHA256& X-Amz-Credential=xxxxxxxx&X-Amz-Date=xxxxxxxx&X-Amz-Expires=300&X-Amz-Security-Token=xxxxxxxx& X-Amz-Signature=xxxxxxxx&X-Amz-SignedHeaders=host",
      "completed_at": "2012-02-22T03:06:58.147Z"
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

