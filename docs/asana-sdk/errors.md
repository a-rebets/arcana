# Error Responses

This document contains the standard error responses used across the Asana API.

## 400

This usually occurs because of a missing or malformed parameter. Check the documentation and the syntax of your request and try again.

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

## 401

A valid authentication token was not provided with the request, so the API could not associate a user with the request.

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

## 402

The request was valid, but the queried object or object mutation specified in the request is above your current premium level.

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

## 403

The authentication and request syntax was valid but the server is refusing to complete the request. This can happen if you try to read or write to objects or properties that the user does not have access to.

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

## 404

Either the request method and path supplied do not specify a known action in the API, or the object specified by the request does not exist.

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

## 500

There was a problem on Asana’s end. In the event of a server error the response body should contain an error phrase. These phrases can be used by Asana support to quickly look up the incident that caused the server error. Some errors are due to server load, and will not supply an error phrase.

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

