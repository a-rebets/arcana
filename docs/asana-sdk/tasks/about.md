# Tasks

The task is the basic object around which many operations in Asana are centered. In the Asana application, multiple tasks populate the middle pane according to some view parameters, and the set of selected tasks determines the more detailed information presented in the details pane.

Sections are unique in that they will be included in the `memberships` field of task objects returned in the API when the task is within a section. They can also be used to manipulate the ordering of a task within a project.

[Queries](/reference/gettasks) return a [compact representation of each task object](/reference/tasks). To retrieve *all* fields or *specific set* of the fields, use [field selectors](/docs/inputoutput-options) to manipulate what data is included in a response.

