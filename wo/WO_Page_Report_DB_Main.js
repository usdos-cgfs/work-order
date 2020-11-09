var WO = window.WO || {};
WO.MOBReport = WO.MOBReport || {};

WO.MOBReport.Init = function()
{
	WO.MOBReport.Report.LoadInfo();
}

WO.MOBReport.NewReportPage = function ()
{			

	/** These are defaulted to Mobile ITs configurations **/
	var m_listTitleHoliday = "WO Holiday IT";
	var m_listTitleWorkOrderCycleTimes = "WO Cycle Time (MOB)";
	var m_libTitleWorkOrder = "Work Order Library";
	var m_libNameWorkOrder = "Work%20Order%20Library";
	var m_woCompletedServiceTypeListView = "ADMINC"; //adminc.aspx
	var m_woActiveServiceTypeListView = "Active"; //active.aspx
	var m_sOwner = ""; //IT
	var m_sAdminStaffUser = null;
	var m_sOffice = null;
	var m_slistTitleWorkOrderCycleTimesInternalYellowThreshold = "KPI_x0020_Yellew_x0020_Threshold";
	var m_slistTitleWorkOrderCycleTimesInternalGreenThreshold = "KPI_x0020_Green_x0020_Threhold";
	
	var m_arrHolidays = new Array();
	var m_arrWO = new Array();

	ko.bindingHandlers.downloadLink = {
	    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	        var path = valueAccessor();
	        var replaced = path.replace(/:([A-Za-z_]+)/g, function(_, token) {
	            return ko.unwrap(viewModel[token]);
	        });
	        element.href = replaced;
	        //alert( replaced );
	    }
	};

	var ToPercentage = function(num){
		return (num.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') ) + "%";
	};

	var ToRound = function(num){
		return Math.round(num);
	};

	/*var handler = function(element, valueAccessor, allBindings){
		var $el = $(element);
		var method;

		// Gives us the real value if it is a computed observable or not
		var valueUnwrapped = ko.unwrap( valueAccessor() );

		if($el.is(':input')){
			method = 'val';
		} else {
			method = 'text';
		}
		return $el[method]( ToPercentage ( valueUnwrapped ) );
	};
*/
	var percHandler = function(element, valueAccessor, allBindings){
		var $el = $(element);
		var method;

		// Gives us the real value if it is a computed observable or not
		var valueUnwrapped = ko.unwrap( valueAccessor() );

		if($el.is(':input')){
			method = 'val';
		} else {
			method = 'text';
		}
		return $el[method]( ToPercentage ( valueUnwrapped ) );
	};

	var roundHandler = function(element, valueAccessor, allBindings){
		var $el = $(element);
		var method;

		// Gives us the real value if it is a computed observable or not
		var valueUnwrapped = ko.unwrap( valueAccessor() );

		if($el.is(':input')){
			method = 'val';
		} else {
			method = 'text';
		}
		return $el[method]( ToRound ( valueUnwrapped ) );
	};

	ko.bindingHandlers.ToPercentage = {
		update: percHandler
	};
	
	ko.bindingHandlers.ToRound = {
		update: roundHandler
	};

	ko.bindingHandlers.toggleClick = {
	    init: function (element, valueAccessor,  allBindings) {
	        var value = valueAccessor();
			
			ko.utils.registerEventHandler(element, "click", function () {
				var classToToggle = allBindings.get('toggleClass');
				var classContainer = allBindings.get('classContainer');
				var containerType = allBindings.get('containerType');
				
				if( containerType && containerType == "sibling")
				{
					$(element).nextUntil( classContainer ).each( function() 
					{
						$(this).toggleClass( classToToggle );
					});
				}
				else if( containerType && containerType == "doc")
				{
					var curIcon = $(element).attr("src");
					if( curIcon == "/_layouts/images/minus.gif")
						$(element).attr("src", "/_layouts/images/plus.gif");
					else
						$(element).attr("src", "/_layouts/images/minus.gif");

					if( $(element).parent() && $(element).parent().parent() )
					{
						$(element).parent().parent().nextUntil( classContainer ).each( function() 
						{
							$(this).toggleClass( classToToggle );
						});
					}
				}
				
				else if( containerType && containerType == "any")
				{
					if( $("." + classToToggle).is(':visible'))
						$("." + classToToggle).hide();
					else
						$("." + classToToggle).show();
				} 
				else
					$(element).find( classContainer ).toggleClass( classToToggle );
	        });
	    }
	};


	function ViewModel( ) 
	{
		var self = this;
		
		self.woLibName = ko.observable( m_libNameWorkOrder );
		self.woCompletedServiceTypeListView = ko.observable( m_woCompletedServiceTypeListView );
		self.woActiveServiceTypeListView = ko.observable( m_woActiveServiceTypeListView );
				
		self.arrItemsCompleted = ko.observableArray( null );
		self.arrItemsActive = ko.observableArray( null );
		
		self.filterDDView = ko.observableArray( null );
		self.filterCBAll = ko.observable( false );
		self.filterDTFrom = ko.observable( null );
		self.filterDTTo = ko.observable( null );
		
		//self.thresholdYellow = ko.observable( 0 ).extend({ notify: 'always' });
		//self.thresholdGreen = ko.observable( 0 ).extend({ notify: 'always' });
		//self.totalWO = ko.observable( 0 ).extend({ notify: 'always' });
		//self.percMeetingStandard = ko.observable( 0 ).extend({ notify: 'always' });
		

		self.thresholdYellow = ko.observable( 0 );
		self.thresholdGreen = ko.observable( 0 );
		self.totalWO = ko.observable( 0 );
		self.percMeetingStandard = ko.observable( 0 );

		self.reportTitle = ko.observable( "" );
		self.office = ko.observable( "" );
					
		self.ClickSubmit = function()
		{	
			m_fnQueryWO();
		}	
				
		self.ClickFilterCBAll = function(item) 
		{
			m_fnSetDateRanges();
			//if (item.Selected() === true) console.log("dissociate item " + item.id());
			//else console.log("associate item " + item.id());
			//self.filterCBAll (!(self.filterCBAll ()));
			return true;
		};
	}
		
	
	var _myViewModel = new ViewModel();
	ko.applyBindings( _myViewModel );
		
	function m_fnLoadInitData( oInitData )
	{
		if( oInitData ) //set the values only if they're provided. Otherwise, keep defaults
		{
			if( oInitData.listTitleHoliday != null )
			{
				m_listTitleHoliday = oInitData.listTitleHoliday;
			}
			if( oInitData.listTitleWorkOrderCycleTimes != null )
			{
				m_listTitleWorkOrderCycleTimes = oInitData.listTitleWorkOrderCycleTimes;
			}
			if( oInitData.libTitleWorkOrder != null )
			{
				m_libTitleWorkOrder = oInitData.libTitleWorkOrder;
			}
			if( oInitData.libNameWorkOrder != null )
			{
				m_libNameWorkOrder = oInitData.libNameWorkOrder;
				_myViewModel.woLibName( m_libNameWorkOrder );
			}
			if( oInitData.woCompletedServiceTypeListView != null )
			{
				m_woCompletedServiceTypeListView = oInitData.woCompletedServiceTypeListView;
				_myViewModel.woCompletedServiceTypeListView ( m_woCompletedServiceTypeListView );
			}
			if( oInitData.woActiveServiceTypeListView != null )
			{
				m_woActiveServiceTypeListView = oInitData.woActiveServiceTypeListView;
				_myViewModel.woActiveServiceTypeListView ( m_woActiveServiceTypeListView );
			}
			if( oInitData.sOwner != null )
			{
				m_sOwner = oInitData.sOwner;
			}
			if( oInitData.slistTitleWorkOrderCycleTimesInternalYellowThreshold != null )
			{
				m_slistTitleWorkOrderCycleTimesInternalYellowThreshold = oInitData.slistTitleWorkOrderCycleTimesInternalYellowThreshold;
			}
			if( oInitData.slistTitleWorkOrderCycleTimesInternalGreenThreshold != null )
			{
				m_slistTitleWorkOrderCycleTimesInternalGreenThreshold = oInitData.slistTitleWorkOrderCycleTimesInternalGreenThreshold;
			}
				
			if( oInitData.sAdminStaffUser != null && oInitData.sAdminStaffUser != "" )
			{
				m_sAdminStaffUser = oInitData.sAdminStaffUser;
				_myViewModel.reportTitle ( m_sAdminStaffUser );	
			}
			
			if(  oInitData.sOffice != null && oInitData.sOffice != "" )
			{
				m_sOffice = oInitData.sOffice;
				_myViewModel.reportTitle ( m_sOffice );	
				_myViewModel.office ( m_sOffice );	
			}
		}
	}

	function m_fnLoadInfo()
	{				
		m_fnSetDateRanges();
		
		 $("#tbDTFrom").datepicker();
		 $("#tbDTTo").datepicker();
		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();
		
		var holidayList = web.get_lists().getByTitle( m_listTitleHoliday );
		var holidayQuery = new SP.CamlQuery();			
		holidayQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="HolidayDate"/></OrderBy></Query></View>');
		m_holidayItems = holidayList.getItems( holidayQuery );
		currCtx.load( m_holidayItems, 'Include(Title, HolidayDate)');

		var cycleTimesList = web.get_lists().getByTitle( m_listTitleWorkOrderCycleTimes );
		var cycleTimesQuery = new SP.CamlQuery();			
		cycleTimesQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_cycleTimesItems = cycleTimesList.getItems( cycleTimesQuery );
		currCtx.load( m_cycleTimesItems, 'Include(Title, Standard, ' + m_slistTitleWorkOrderCycleTimesInternalYellowThreshold + ', ' + m_slistTitleWorkOrderCycleTimesInternalGreenThreshold + ')');

		var workOrderList = web.get_lists().getByTitle( m_libTitleWorkOrder );
		var workOrderQuery = new SP.CamlQuery();			
		workOrderQuery.set_viewXml('<View><Query><OrderBy><FieldRef Name="Title"/></OrderBy></Query></View>');
		m_workOrderItems = workOrderList.getItems( workOrderQuery );
		currCtx.load( m_workOrderItems, 'Include(Request_x0020_Date1, Completion_x0020_Date1)');
		
		currCtx.executeQueryAsync(OnSuccess, OnFailure);	
		function OnSuccess(sender, args)
		{						
			$("#divLoading").hide();
			m_fnLoadData();						
			m_fnQueryWO();
		}		
		function OnFailure(sender, args)
		{
			$("#divLoading").hide();
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
	}	
	
	function m_fnSetDateRanges()
	{	
		if( _myViewModel.filterCBAll() )
		{
			_myViewModel.filterDTFrom( "" );
			_myViewModel.filterDTTo( "" );
		}
		else
		{
			var curDate = new Date();
			var curMonth = curDate.getMonth();
			var curYear = curDate.getFullYear();
			curDate.setMonth( curMonth + 1 );
			curDate.setDate( 1 );
			curDate.setDate( curDate.getDate() - 1 );
			var lastDayOfCurMonth = curDate.getDate();
			
			var beginningOfMonth = m_fnPadDigits(curMonth + 1, 2) + "/01/" + curYear;
			var endOfMonth = m_fnPadDigits(curMonth + 1, 2) + "/" + m_fnPadDigits(lastDayOfCurMonth, 2) + "/" + curDate.getFullYear();
			
			_myViewModel.filterDTFrom( beginningOfMonth );
			_myViewModel.filterDTTo( endOfMonth );
		}
	}	
	
	function m_fnLoadData()
	{
		m_fnLoadHolidays();
		m_fnLoadCycleTimes();
	}
	
	function m_fnLoadHolidays()
	{
		m_arrHolidays = new Array();

		try
		{			
			var listItemEnumerator = m_holidayItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				var holidayDate = oListItem.get_item('HolidayDate');
				var desc = oListItem.get_item('Title');

				var hObject = new Object();
				hObject ["holidayDate"] = holidayDate;
				hObject ["desc"] = desc;
				m_arrHolidays.push( hObject );
			}        
		}
		catch( err )
		{
			alert( err );
		}
	}

	function m_fnLoadCycleTimes()
	{
		m_arrCycleTimes = new Array();

		try
		{			
			var listItemEnumerator = m_cycleTimesItems.getEnumerator();
			while(listItemEnumerator.moveNext())
			{
				var oListItem = listItemEnumerator.get_current();
				
				var serviceType = oListItem.get_item('Title');
				var standard = oListItem.get_item('Standard');
				var thresholdYellow = oListItem.get_item( m_slistTitleWorkOrderCycleTimesInternalYellowThreshold );
				var thresholdGreen = oListItem.get_item( m_slistTitleWorkOrderCycleTimesInternalGreenThreshold );

				var cObject = new Object();
				cObject ["serviceType"] = serviceType;
				cObject ["standard"] = standard;
				m_arrCycleTimes.push( cObject );
				
				if( thresholdYellow != "" && thresholdYellow > 0 )
				{					
					_myViewModel.thresholdYellow( thresholdYellow );
					_myViewModel.thresholdGreen( thresholdGreen );
					//alert( thresholdGreen );
				}
			}        			
		}
		catch( err )
		{
			alert( err );
		}
	}
	

	function m_fnQueryWO()
	{
		$("#divLoading").show();

		$("#completedTotalWO").text("");
		$("#completedTotalMtgStandard").text("");
		$("#completedTotalNotMtgStandard").text("");
		$("#completedTotalMtgStandardPerc").text("");
		$("#completedTotalKPI").text("");
		$("#completedTotalAvgDays").text("");		
		$("#completedTotalAvgDays").attr("title", "");

		$("#activeTotalWO").text("");
		$("#activeTotalLate").text("");
		$("#activeTotalLatePer").text("");
		$("#activeTotalKPI").text("");
		
		_myViewModel.totalWO ( 0 );
		_myViewModel.percMeetingStandard( 0 );

		_myViewModel.arrItemsCompleted( [] );
		_myViewModel.arrItemsCompleted.valueHasMutated();

		_myViewModel.arrItemsActive( [] );
		_myViewModel.arrItemsActive.valueHasMutated();
	
		var query = "";
		var filterType = _myViewModel.filterDDView();
		if( filterType == "Active")
		{
			if( m_sOwner != null && m_sOwner != "" )
				query = '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="Owner"/><Value Type="Text">' + m_sOwner + '</Value></Eq><IsNull><FieldRef Name="Completion_x0020_Date1"/></IsNull></And></Where></Query></View>';
			else
				query = '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><IsNull><FieldRef Name="Completion_x0020_Date1"/></IsNull></Where></Query></View>';
		}
		else //Completed
		{
			var cbAll = _myViewModel.filterCBAll();
			if( cbAll )
			{
				if( m_sOwner != null && m_sOwner != "" )
					query = '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><And><Eq><FieldRef Name="Owner"/><Value Type="Text">' + m_sOwner + '</Value></Eq><Eq><FieldRef Name="Request_x0020_Status1"/><Value Type="Text">Completed</Value></Eq></And></Where></Query></View>';
				else
					query = '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where><Eq><FieldRef Name="Request_x0020_Status1"/><Value Type="Text">Completed</Value></Eq></Where></Query></View>';
			}
			else
			{
				var dtFrom = _myViewModel.filterDTFrom();
				var dtTo = _myViewModel.filterDTTo();

				var dtFromDate = new Date( dtFrom );
				var dtFrom = dtFromDate.format("yyyy-MM-ddTHH:mm:ssZ");
				
				var dtToDate = new Date( dtTo );
				var dtTo = dtToDate.format("yyyy-MM-ddTHH:mm:ssZ");

				if ( dtFromDate > dtToDate ) 
				{
		            alert("The date range is invalid");
					$("#divLoading").hide();
		            return false;
				}

				if( m_sOwner != null && m_sOwner != "" )
				{
					query = '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where>' +
					'<And>' + 
						'<And>' + 
							'<And>' + 
								'<Eq><FieldRef Name="Owner"/><Value Type="Text">' + m_sOwner + '</Value></Eq>' + 
								'<Eq><FieldRef Name="Request_x0020_Status1"/><Value Type="Text">Completed</Value></Eq>' + 
							'</And>' +
							'<Geq><FieldRef Name="Completion_x0020_Date1" /><Value Type="DateTime" IncludeTimeValue="FALSE">' + dtFrom + '</Value></Geq>' + 
						'</And>' +
						'<Leq><FieldRef Name="Completion_x0020_Date1" /><Value Type="DateTime" IncludeTimeValue="FALSE">' + dtTo + '</Value></Leq>' + 
					'</And>' +
					'</Where></Query></View>';
				}
				else
				{
					query = '<View Scope="RecursiveAll"><Query><OrderBy><FieldRef Name="Title"/></OrderBy><Where>' +
					'<And>' + 
						'<And>' + 
							'<Leq><FieldRef Name="Completion_x0020_Date1" /><Value Type="DateTime" IncludeTimeValue="FALSE">' + dtTo + '</Value></Leq>' + 
							'<Eq><FieldRef Name="Request_x0020_Status1"/><Value Type="Text">Completed</Value></Eq>' + 
						'</And>' +
						'<Geq><FieldRef Name="Completion_x0020_Date1" /><Value Type="DateTime" IncludeTimeValue="FALSE">' + dtFrom + '</Value></Geq>' + 
					'</And>' +
					'</Where></Query></View>';
				}
			}
		}
		
		var currCtx = new SP.ClientContext.get_current();
		var web = currCtx.get_web();

		var workOrderList = web.get_lists().getByTitle( m_libTitleWorkOrder );
		var workOrderQuery = new SP.CamlQuery();			
		workOrderQuery.set_viewXml( query );
		m_workOrderItems = workOrderList.getItems( workOrderQuery );
		currCtx.load( m_workOrderItems, 'Include(ID, Title, Service_x0020_Type1, Response_x0020_Status, Request_x0020_Date1, Completion_x0020_Date1, Admin_x0020_Staff, Requestor_x0020_Office1)');
		
		function OnSuccessLoadWO(sender, args)
		{	
			var oMain = new Object();
			
			var filterType = _myViewModel.filterDDView();
			if( filterType == "Completed")
			{
				for( var x = 0; x < m_arrCycleTimes.length; x++ )
				{
					var oObject = new Object();				
					var curCycleTime = m_arrCycleTimes[x];
					
					oObject.serviceType = curCycleTime.serviceType;
					oObject.standard = curCycleTime.standard;
					oObject.completedWO = 0;
					oObject.completedTotalDays = 0;
					oObject.completedDays = 0;
					oObject.completedMeetingStandard = 0;
					oObject.completedNotMeetingStandard = 0;
					oObject.completedPercMeetingStandard = 0;
					oObject.lateIDs = new Array();
					oObject.completedAvgTime = 0;
					oObject.completedAvgTimeFloat = 0;
					
					oMain[ oObject.serviceType ] = oObject;
				}

				var listItemEnumerator = m_workOrderItems.getEnumerator();
				while(listItemEnumerator.moveNext())
				{
					var oListItem = listItemEnumerator.get_current();

					var sAdminStaff = oListItem.get_item('Admin_x0020_Staff');
					
					if( m_sAdminStaffUser != null && sAdminStaff == null )
						continue;						
					if( m_sAdminStaffUser != null && sAdminStaff != null && sAdminStaff.toLowerCase() != m_sAdminStaffUser.toLowerCase() )
						continue;
					
					var sOffice = oListItem.get_item('Requestor_x0020_Office1');
					if( m_sOffice != null && sOffice == null  )
						continue;
					if( m_sOffice != null && sOffice != null && sOffice.toLowerCase() != m_sOffice.toLowerCase() )
						continue;

					var resStatus = oListItem.get_item('Response_x0020_Status');
					var dtRequested = oListItem.get_item('Request_x0020_Date1');
					var dtCompleted = oListItem.get_item('Completion_x0020_Date1');
					
					var serviceType = oListItem.get_item('Service_x0020_Type1');
											
					if( oMain[ serviceType ] != null ) //access faster
					{
						oMain[ serviceType ].completedWO ++;
						
						var daysToComplete =  m_fnGetWorkDays( dtRequested, dtCompleted );
						oMain[ serviceType ].completedDays = daysToComplete;
						
						oMain[ serviceType ].completedTotalDays += daysToComplete;
						
						if( daysToComplete <= oMain[ serviceType ].standard )
							oMain[ serviceType ].completedMeetingStandard ++;
						else
						{
							oMain[ serviceType ].completedNotMeetingStandard ++;
							
							var oLate = new Object();
							oLate.ID = oListItem.get_item('ID');
						
							oLate.Days = daysToComplete;
							oLate.listName = m_libNameWorkOrder;
							oMain[ serviceType ].lateIDs.push( oLate );
						}
						
						if( oMain[ serviceType ].completedWO > 0 )
						{
							oMain[ serviceType ].completedPercMeetingStandard = Math.round( (oMain[ serviceType ].completedMeetingStandard / oMain[ serviceType ].completedWO) * 100 );
							oMain[ serviceType ].completedAvgTime = Math.ceil( oMain[ serviceType ].completedTotalDays / oMain[ serviceType ].completedWO );
							oMain[ serviceType ].completedAvgTimeFloat = oMain[ serviceType ].completedTotalDays / oMain[ serviceType ].completedWO;
						}
					}				
				}        

				var completedTotalWO = 0;
				var completedTotalMtgStandard = 0;
				var completedTotalNotMtgStandard = 0;
				var completedTotalMtgStandardPerc = 0;
				var completedTotalAvgDays = 0;
				var completedTotalAvgDaysFloat = 0;
				var completedTotalDays = 0;
		
				//get the ones that have some values
				var arrServices = new Array();
				for( var x = 0; x < m_arrCycleTimes.length; x++ )
				{
					var service = m_arrCycleTimes[x].serviceType;
					//if( oMain[ service ].completedWO > 0 )
					//{
						arrServices.push( oMain[ service ] );
						
						completedTotalWO += oMain[ service ].completedWO;
						completedTotalMtgStandard += oMain[ service ].completedMeetingStandard;
						completedTotalNotMtgStandard += oMain[ service ].completedNotMeetingStandard;
						completedTotalDays += oMain[ service ].completedTotalDays;
					//}
				}
	
				if( completedTotalWO > 0 )
				{
					completedTotalMtgStandardPerc = ( completedTotalMtgStandard / completedTotalWO ) * 100 ;
					completedTotalAvgDays = completedTotalDays / completedTotalWO;
					
					completedTotalMtgStandardPerc = Math.round( completedTotalMtgStandardPerc );
					completedTotalAvgDaysFloat = completedTotalAvgDays;
					completedTotalAvgDays = Math.ceil( completedTotalAvgDays );
				}
			
				ko.utils.arrayPushAll( _myViewModel.arrItemsCompleted, arrServices);
				_myViewModel.arrItemsCompleted.valueHasMutated();
				
				
				$("#completedTotalWO").text( completedTotalWO );
				$("#completedTotalMtgStandard").text( completedTotalMtgStandard );
				$("#completedTotalNotMtgStandard").text( completedTotalNotMtgStandard );
				$("#completedTotalMtgStandardPerc").text( completedTotalMtgStandardPerc + "%");
				$("#completedTotalAvgDays").text( completedTotalAvgDays );
				$("#completedTotalAvgDays").attr("title", completedTotalAvgDaysFloat );
				
				
				_myViewModel.totalWO ( completedTotalWO );
				_myViewModel.percMeetingStandard( completedTotalMtgStandardPerc );
			}
			
			
			else if( filterType == "Active" )
			{
				for( var x = 0; x < m_arrCycleTimes.length; x++ )
				{
					var oObject = new Object();				
					var curCycleTime = m_arrCycleTimes[x];
					
					oObject.serviceType = curCycleTime.serviceType;
					oObject.standard = curCycleTime.standard;
					oObject.activeWO = 0;
					oObject.activeDays = 0;
					oObject.activeLate = 0;
					oObject.activeLatePerc = 0;
					oObject.kpiColor = 0;
					oObject.activeMeetingStandard = 0;
					oObject.activePercMeetingStandard = 100; //set this to default to 100 if there are none active
					
					oObject.activetotalDays = 0;
					oMain[ oObject.serviceType ] = oObject;
				}
				
				var curDate = new Date();
				
				var listItemEnumerator = m_workOrderItems.getEnumerator();
				while(listItemEnumerator.moveNext())
				{
					var oListItem = listItemEnumerator.get_current();
					
					var sAdminStaff = oListItem.get_item('Admin_x0020_Staff');
					if( m_sAdminStaffUser != null && sAdminStaff == null )
						continue;
					if( m_sAdminStaffUser != null && sAdminStaff != null && sAdminStaff.toLowerCase() != m_sAdminStaffUser.toLowerCase() )
						continue;

					var sOffice = oListItem.get_item('Requestor_x0020_Office1');
					if( m_sOffice != null && sOffice == null )
						continue;
					if( m_sOffice != null && sOffice != null && sOffice.toLowerCase() != m_sOffice.toLowerCase() )
						continue;

					var resStatus = oListItem.get_item('Response_x0020_Status');
					var dtRequested = oListItem.get_item('Request_x0020_Date1');
					var dtCompleted = oListItem.get_item('Completion_x0020_Date1');
					
					var serviceType = oListItem.get_item('Service_x0020_Type1');
					if( oMain[ serviceType ] != null ) //access faster
					{
						oMain[ serviceType ].activeWO ++;
						
						var daysActive =  m_fnGetWorkDays( dtRequested, curDate);
						oMain[ serviceType ].activeDays = daysActive;
						
						oMain[ serviceType ].activetotalDays += daysActive;
						
						if( daysActive > oMain[ serviceType ].standard )
							oMain[ serviceType ].activeLate ++;
						else
							oMain[ serviceType ].activeMeetingStandard ++;

						if( oMain[ serviceType ].activeWO > 0 )
						{
							oMain[ serviceType ].activePercMeetingStandard = (oMain[ serviceType ].activeMeetingStandard / oMain[ serviceType ].activeWO ) * 100;
							oMain[ serviceType ].activeLatePerc = (oMain[ serviceType ].activeLate / oMain[ serviceType ].activeWO ) * 100;
						}	
							
					}				
				} 
				
				var activeTotalWO = 0;
				var activeTotalLate = 0;
				var activeTotalLatePer = 0;
				var activeTotalKPI = 0;
				var activeTotalMeetingStandard = 0;
				var activeTotalPercMeetingStandard = 100; //default to 100 in case there are none active

				//get the ones that have some values
				var arrServices = new Array();
				for( var x = 0; x < m_arrCycleTimes.length; x++ )
				{
					var service = m_arrCycleTimes[x].serviceType;
					//if( oMain[ service ].activeWO > 0 )
					//{
						arrServices.push( oMain[ service ] );
						
						activeTotalWO += oMain[ service ].activeWO;
						activeTotalLate += oMain[ service ].activeLate;
						activeTotalMeetingStandard += oMain[ service ].activeMeetingStandard;
					//}
				}

				if( activeTotalWO > 0 )
				{
					activeTotalLatePer = ( activeTotalLate / activeTotalWO ) * 100;					
					activeTotalLatePer = Math.round( activeTotalLatePer );
					
					activeTotalPercMeetingStandard = Math.round( ( activeTotalMeetingStandard / activeTotalWO ) * 100 );
				}

				ko.utils.arrayPushAll( _myViewModel.arrItemsActive, arrServices);
				_myViewModel.arrItemsActive.valueHasMutated();      
				 
				$("#activeTotalWO").text( activeTotalWO );
				$("#activeTotalLate").text( activeTotalLate );
				$("#activeTotalLatePer").text( activeTotalLatePer + "%");
				$("#activeTotalKPI").text( activeTotalKPI );

				_myViewModel.totalWO( activeTotalWO );
				_myViewModel.percMeetingStandard( activeTotalPercMeetingStandard );
			}
			
			$("#divLoading").hide();
		}		
		function OnFailureLoadWO(sender, args)
		{
			$("#divLoading").hide();
			statusId = SP.UI.Status.addStatus("Request failed: "  + args.get_message() + "\n" + args.get_stackTrace());
   			SP.UI.Status.setStatusPriColor(statusId, 'red');
		}
		currCtx.executeQueryAsync(OnSuccessLoadWO, OnFailureLoadWO);	
	}
	
	function m_fnGetWorkDays( dtStart, dtEnd )
	{
		if( !dtStart || !dtEnd )
			return 0;
		
		if( dtStart > dtEnd )
			return 0;
		
		var tmpDate1 = new Date( dtStart.format("MM/dd/yyyy") );
		var tmpDate2 = new Date( dtEnd.format("MM/dd/yyyy") );
		
		var bDone = false;
		
		var cntDays = 0;
		while( !bDone )
		{
			if( tmpDate1 <= tmpDate2 )
			{
				var dayOfWeek = tmpDate1.getDay();
				if( dayOfWeek > 0 && dayOfWeek < 6 )
				{
					var bFound = false;
					for( var x = 0; x < m_arrHolidays.length; x++ )
					{
						if( m_arrHolidays[x]["holidayDate"].format("MM/dd/yyyy") == tmpDate1.format("MM/dd/yyyy"))
						{
							bFound = true;
							break;
						}
					}
					
					if( !bFound )
						cntDays++;
				}
			}
			else
			{
				bDone = true;
			}
			
			tmpDate1.setDate( tmpDate1.getDate() + 1);
			
		}
		
		return cntDays;
	}
	
	function m_fnPadDigits(n, totalDigits) 
	{ 
		n = n.toString(); 
		var pd = ''; 
		if (totalDigits > n.length) 
		{ 
			for (i = 0; i < (totalDigits-n.length); i++) 
			{ 
				pd += '0'; 
			} 
		} 
		return pd + n.toString(); 
	} 

	var publicMembers = 
	{
		LoadInitData: function( oInitData ){ m_fnLoadInitData( oInitData ); },
		LoadInfo: m_fnLoadInfo,
		UpdateAdminStaff: function( sStaffName ) { m_sAdminStaffUser = sStaffName; _myViewModel.reportTitle( sStaffName ); },
		UpdateOffice: function( sOffice ) { m_sOffice = sOffice ; _myViewModel.reportTitle( sOffice ); }
	}
	
	return publicMembers;
}	