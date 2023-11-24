## Design Choices

Perhaps too much effort was put into conforming to the standards set by the tools, notably the preference of using composition over inheritance and using functional object factories. Not all Models need to be ViewModels. A distinction between entity/value objects and ui specific aspects only started to be clear after implementing knockout components. I.e. the errors that a field component returns will be important to the app, the class that's applied based on the error state doesn't matter. One should be in the component model, one should be passed as a reference.

### Requests and Service Types

The relationship between requests and the servicetype specific detail may have been better implemented using inheritance, where the Service Type class would extend the Request.
This would add complexity while interacting with the persistence layer, since both entities would be stored in separate tables, however that added complexity would have been contained in the ApplicationDbContext.

### Entities

How Entities were designed to be read and written to the persistence layer (SharePoint) was overly complicated to reduce the need
to overdeclare the fields. The goal was to accomodate reading and writing to properties, observables, and leveraging the fieldmaps that were also used for presentation without having to declare each as such.

A separate configuration object for each entity would probably have worked better than overloading the fieldmap for both presentation and reading/writing.

Overall, pretty happy with the Field classes and their respective components, though maybe it couples the presentation and persistence layers (see above).

Some of the functionality is done in views/components, but would probably be better serviced using a separate service, e.g. A RequestManager to load and modify requests.

### Platform Specific Hurdles

The "all open assignments" lists is fetched separately from the "All Open Requests". Since the app is client side, this was done to reduce the number of separate requests over the wire, each open request would have generated a separate request to get it's open assignments.

## Separating Layers

Application - Should use defined classes everywhere, we shouldn't be passing JSON/other untyped objects around.

Infrastructure - Should take defined classes and generate JSON objects to pass to SAL. JSON Objects should be SAL specific but SharePoint agnostic (e.g. we should define the types in SAL, but shouldn't include SP specific encodings/structures)

Two types of data to be encoded: Entities and Fields
Field types:

- Blob\*
- Checkbox
- Date
- Lookup\*
- People\*
- Select\*
- TextArea
- Text

\* fields can support multiple items

For each field we need to define the following mappings:

- JSON - for reading/writing from storage.
- String - for displaying/human readable format
- ???

Blob field should be interchangeable with Lookup, we're basically storing the entire object rather than just a key (this can be handled in SAL?)

## Request Service Type Logic

Let's assume that we'll always know the service type of our requests
