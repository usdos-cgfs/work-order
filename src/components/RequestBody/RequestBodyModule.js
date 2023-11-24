export default class RequestBodyModule {
  constructor({ DisplayMode, request }) {
    Object.assign(this, request.ServiceType);
    this.DisplayMode = DisplayMode;
    this.RequestDescription = request.RequestDescription;

    this.RequestBodyBlobField = request.RequestBodyBlob;
    // this.Entity.subscribe(this.serviceTypeEntityWatcher);
  }

  ServiceTypeComponentName = ko.pureComputed(() => {
    if (!this.Entity()) return null;
    const componentsMap = this.Entity().components;
    // const componentsMap = this.Def().getViewComponents();
    // if (!componentsMap) {
    //   return null;
    // }
    return componentsMap[this.DisplayMode().toLowerCase()];
  });

  //   serviceTypeEntityWatcher = (newSvcType, oldSvcType) => {
  //     if (newSvcType?.UID == oldSvcType?.UID) return;
  //   };
}
