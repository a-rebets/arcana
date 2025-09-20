# Projects

A project represents a prioritized list of tasks in Asana or a board with columns of tasks represented as cards. A project exists in a single workspace or organization and is accessible to a subset of users in that workspace or organization, depending on its permissions.

Projects in organizations are shared with a single team. Currently, the team of a project cannot be changed via the API. Non-organization workspaces do not have teams and so you should not specify the team of project in a regular workspace.

Followers of a project are a subset of the members of that project. Followers of a project will receive all updates including tasks created, added and removed from that project. Members of the project have access to and will receive status updates of the project. Adding followers to a project will add them as members if they are not already, removing followers from a project will not affect membership.

**Note:** You can use certain project endpoints to operate on [user task lists](/reference/user-task-lists) ([My Tasks](https://asana.com/guide/help/fundamentals/my-tasks)) by substituting the `{project_gid}` with the `{user_task_list_gid}`. For example, you can perform operations on the custom fields of a user task list by using the following projects endpoints: [Add a custom field to a project](/reference/addcustomfieldsettingforproject), [Remove a custom field from a project](/reference/removecustomfieldsettingforproject) and [Get a project's custom fields](/reference/getcustomfieldsettingsforproject)