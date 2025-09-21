# GET /attachments/{attachment_gid}

**Summary:** Get an attachment

**Description:** <b>Required scope: </b><code>attachments:read</code>

Get the full record for a single attachment.

**Operation ID:** getAttachment

**Tags:** Attachments

## Path Parameters

| Name | Type | Required | Description | Constraints |
|------|------|----------|-------------|-------------|
| attachment_gid | string | ✅ | Globally unique identifier for the attachment. | - |

## Query Parameters

| Name | Type | Required | Description | Default | Constraints |
|------|------|----------|-------------|---------|-------------|
| opt_pretty | boolean | ❌ | Provides “pretty” output. Provides the response in a “pretty” format. In the case of JSON this means doing proper line breaking and indentation to make it readable. This will take extra time and increase the response size so it is advisable only to use this during debugging. | - | - |
| opt_fields | array | ❌ | This endpoint returns a resource which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include. | - | - |

## Allowed optional fields

```
connected_to_app,created_at,download_url,host,name,parent,parent.created_by,parent.name,parent.resource_subtype,permanent_url,resource_subtype,size,view_url
```

## Responses

### 200

Successfully retrieved the record for a single attachment.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "data": {
    "gid": "12345",
    "resource_type": "attachment",
    "name": "Screenshot.png",
    "resource_subtype": "dropbox",
    "created_at": "2012-02-22T02:06:58.147Z",
    "download_url": "https://s3.amazonaws.com/assets/123/Screenshot.png",
    "permanent_url": "https://app.asana.com/app/asana/-/get_asset?asset_id=1234567890",
    "host": "dropbox",
    "parent": {
      "gid": "12345",
      "resource_type": "task",
      "name": "Bug Task",
      "resource_subtype": "default_task",
      "created_by": {
        "gid": "1111",
        "resource_type": "user"
      }
    },
    "size": 12345,
    "view_url": "https://www.dropbox.com/s/123/Screenshot.png",
    "connected_to_app": true
  }
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

### 424

You have exceeded one of the enforced rate limits in the API. See the [documentation on rate limiting](https://developers.asana.com/docs/#rate-limits) for more information.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "errors": [
    {
      "message": "project: Missing input",
      "help": "For more information on API status codes and how to handle them, read the docs on errors: https://asana.github.io/developer-docs/#errors'",
      "phrase": "6 sad squid snuggle softly"
    }
  ]
}
```

### 500

<reference>

### 501

There is an issue between the load balancers and Asana's API.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "errors": [
    {
      "message": "project: Missing input",
      "help": "For more information on API status codes and how to handle them, read the docs on errors: https://asana.github.io/developer-docs/#errors'",
      "phrase": "6 sad squid snuggle softly"
    }
  ]
}
```

### 503

Either the upstream service is unavailable to the API, or the API has been intentionally shut off.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "errors": [
    {
      "message": "project: Missing input",
      "help": "For more information on API status codes and how to handle them, read the docs on errors: https://asana.github.io/developer-docs/#errors'",
      "phrase": "6 sad squid snuggle softly"
    }
  ]
}
```

### 504

This request took too long to complete.

**Content Types:**

#### application/json

**Example Response:**

```json
{
  "errors": [
    {
      "message": "project: Missing input",
      "help": "For more information on API status codes and how to handle them, read the docs on errors: https://asana.github.io/developer-docs/#errors'",
      "phrase": "6 sad squid snuggle softly"
    }
  ]
}
```

## Security

- **oauth2** (scopes: attachments:read)

