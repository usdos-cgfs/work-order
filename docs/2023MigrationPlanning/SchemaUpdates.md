The following lists need to have their respective Titles mapped to Request Lookup Fields:

- Assignment
- Action
- Comment
- DateRanges
- st\_\*
- WorkOrderDocuments
- WorkOrderEmails

## List Schema Changes

| WorkOrder                                                |
| -------------------------------------------------------- |
| RequestorOffice -> RequestingOffice \[ConfigRequestOrg\] |
| RequestStage -> PipelineStage \[ConfigPipeline\]         |
| \- RequestorName                                         |
| \- RequestStagePrev (v)                                  |
| \- RequestStagePrev (v)                                  |
| \- InternalStatus (v)                                    |
| \- ManagingDirector (migrate to ServiceType)             |
| \- RequestorSupervisor (migrate to ServiceType)          |

| ConfigRequestOrg |
| ---------------- |
| + PreferredEmail |

| ConfigServiceTypes                     |
| -------------------------------------- |
| + HasTemplate (? Replace with has UID) |
| \- TemplateName                        |
| \- st_list                             |
| \- ReminderDays (v)                    |
| \- RequestOrgs (v)                     |
| \- ActionOffices (v)                   |
| \- SupervisorRequired (v)              |
| \- HideReport (v)                      |

| Action          |
| --------------- |
| - SendEmail (v) |
| - Request       |

| Assignments                                            |
| ------------------------------------------------------ |
| PipelineStage -> PipelineStage \[ConfigPipelineStage\] |
| + Request\* \[WorkOrder\]                              |
| - ReqId                                                |
| - ActionOffice                                         |

| PipelineStage                           |
| --------------------------------------- |
| + ActionTargetStage \[ConfigPipelines\] |
| + Assignee \[Person or Group\]          |
| + AssignmentFunction                    |
| + ActionComponentName                   |
| - WildCardAssignee                      |
