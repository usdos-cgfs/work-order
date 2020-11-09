var WO = window.WO || {};
WO.MOBReport = WO.MOBReport|| {};


ExecuteOrDelayUntilScriptLoaded(InitAdminReport, "sp.js");	

function InitAdminReport() 
{    
WO.MOBReport.Report = new WO.MOBReport.NewReportPage();

	function UpdateConfigurationValFromText( objectFieldName, configurationFieldId )
	{
		var filterFieldText = $("#" + configurationFieldId ).text();
		if( filterFieldText != null && filterFieldText != "" )
		{
			oInitDataObject[ objectFieldName ] = filterFieldText;
		}
	}

  
	
	var oInitDataObject = new Object();

	UpdateConfigurationValFromText( "listTitleHoliday", "lblListTitleHoliday");
	UpdateConfigurationValFromText( "listTitleWorkOrderCycleTimes", "lbllistTitleWorkOrderCycleTimes");
	UpdateConfigurationValFromText( "libTitleWorkOrder", "lbllibTitleWorkOrder");
	UpdateConfigurationValFromText( "libNameWorkOrder", "lbllibNameWorkOrder");
	UpdateConfigurationValFromText( "woCompletedServiceTypeListView", "lblwoCompletedServiceTypeListView");
	UpdateConfigurationValFromText( "woActiveServiceTypeListView", "lblwoActiveServiceTypeListView");
	UpdateConfigurationValFromText( "sOwner", "lblsOwner");
	UpdateConfigurationValFromText( "slistTitleWorkOrderCycleTimesInternalYellowThreshold", "lblslistTitleWorkOrderCycleTimesInternalYellowThreshold");
	UpdateConfigurationValFromText( "slistTitleWorkOrderCycleTimesInternalGreenThreshold", "lblslistTitleWorkOrderCycleTimesInternalGreenThreshold");

	//this is read from the hidden web part on the page
	//reading it so we don't have to duplicate this code

	var filterAdmin = $("#tbFilterAdmin").val();
	if( filterAdmin != null && filterAdmin != "" )
	{
		oInitDataObject.sAdminStaffUser = filterAdmin;
	}

	$("#tbFilterAdmin").change(function(){
		WO.MOBReport.Report.UpdateAdminStaff( $(this).val() ) ;
	});

	var filterOffice = $("#tbFilterOffice").val();
	if( filterOffice != null && filterOffice != "" )
	{
		oInitDataObject.sOffice = filterOffice;
	}

	$("#tbFilterOffice").change(function(){
		WO.MOBReport.Report.UpdateOffice( $(this).val() ) ;
	});

	WO.MOBReport.Report.LoadInitData( oInitDataObject );
	WO.MOBReport.Init();
}