# Assignments

## Overview

## How Assignments Are Created

### Pending Assignment Action

The pending assignment action will create a new action of the target stages Action Type using the stageActionRoleMap.

### Current Stage Assignments

The current stage will create assignments with the role provided by stageActionRoleMap.
If an Assignee is provided, they will be used, otherwise, the assignment will default to the stages Request Org group.
If an AssignmentFunction is provided, the AssignmentFunctions object in the Authorization file will be run using the
curren request as the binding context.

What if a stage is already assigned by a Pending Assignment Action?  
The stage will not be assigned if there are existing assignments.
