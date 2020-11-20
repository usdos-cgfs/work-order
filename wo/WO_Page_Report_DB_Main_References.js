<iframe id="CsvExpFrame" style="display: none"></iframe>

<div id="divLoading" style="color:green; padding-bottom:10px">Please Wait... Loading</div>

<div style="padding-bottom:10px">
	<span style="color:#0072bc; font-weight:bold; font-size:12pt" data-bind="text: reportTitle"></span>
</div>

<div id="divStatusReportRequests" style="width:300px">
	<div>
		<table>
			<tr>
				<td style="vertical-align:top">
					<fieldset>
						<legend>Filter Work Orders</legend>
						<table>

							<tr>
								<td>View:</td>
								<td>
									<select data-bind="value: filterDDView">
										<option value="Completed">Completed</option>
										<option value="Active">Active</option>
									</select>
								</td>
							</tr>
							<tr data-bind="visible: filterDDView() == 'Completed'">
								<td colspan="2">
									<fieldset>
										<legend>Date Range</legend>
										<table>
											<tr>
												<td>All</td>
												<td><input type="checkbox" id="cbAll" data-bind="checked: filterCBAll, click: $root.ClickFilterCBAll"></input></td>
											</tr>
											<tr>
												<td>From</td>
												<td><input type="textbox" id="tbDTFrom" data-bind="textInput: filterDTFrom"></input></td>
											</tr>
											<tr>
												<td>To</td>
												<td><input type="textbox" id="tbDTTo" data-bind="textInput: filterDTTo"></input></td>
											</tr>
										</table>
									</fieldset>
								</td>
							</tr>
							<tr>
								<td colspan="2">
									<input type="button" value="Submit" data-bind="click: $root.ClickSubmit"></input>
								</td>
							</tr>	
						</table>
					</fieldset>	

				</td>
				<td style="vertical-align:top">
					<table id="tblCompleted" style="display:none" class="tablesorter report" data-bind="visible: arrItemsCompleted().length > 0 && filterDDView() == 'Completed'">
						<thead>
							<tr valign="top">
								<th class="sorter-false" nowrap="nowrap" colspan="2">Total Completed</th>
								<th class="sorter-false" nowrap="nowrap"><span id="completedTotalWO"></span></th>
								<th class="sorter-false" nowrap="nowrap"><span id="completedTotalMtgStandard"></span></th>
								<th class="sorter-false" nowrap="nowrap"><span id="completedTotalNotMtgStandard"></span></th>
								<th class="sorter-false" nowrap="nowrap"><span id="completedTotalMtgStandardPerc"></span></th>
								<th class="sorter-false" nowrap="nowrap">
									<span data-bind="if: $root.percMeetingStandard() >= $root.thresholdGreen() && $root.totalWO() > 0"><img src='../PublishingImages/KPIGreen.GIF'></img></span>
									<span data-bind="if: $root.percMeetingStandard() < $root.thresholdGreen() && $root.percMeetingStandard() >= $root.thresholdYellow() && $root.totalWO() > 0"><img src='../PublishingImages/KPIGold.GIF'></img></span>
									<span data-bind="if: $root.percMeetingStandard() < $root.thresholdYellow() && $root.totalWO() > 0"><img src='../PublishingImages/KPIRed.GIF'></img></span>
								</th>
								<th class="sorter-false" nowrap="nowrap"></th>
								<th class="sorter-false" nowrap="nowrap"><span id="completedTotalAvgDays"></span></th>
							</tr>
							<tr valign="top">
								<th class="sorter-false" nowrap="nowrap"></th>
								<th class="sorter-false" nowrap="nowrap">Standard</th>
								<th class="sorter-false" nowrap="nowrap"># Compl WOs</th>
								<th class="sorter-false" nowrap="nowrap"># Mtg Std</th>
								<th class="sorter-false" nowrap="nowrap"># Not Mtg Std</th>
								<th class="sorter-false" nowrap="nowrap">% Mtg Std</th>
								<th class="sorter-false" nowrap="nowrap">KPI</th>
								<th class="sorter-false" nowrap="nowrap">Late IDs/Duration</th>
								<th class="sorter-false" nowrap="nowrap">Avg Compl Time (Days)</th>
							</tr>
						</thead>
						<tbody id="fbody" data-bind="foreach: arrItemsCompleted">
							<tr>
								<td nowrap>
									<span data-bind="if: $root.reportTitle() == null || $root.reportTitle() == ''">
										<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/' + $root.woCompletedServiceTypeListView() + '.aspx?FilterField1=Service%5Fx0020%5FType1&FilterValue1=' + serviceType}"><span data-bind="text: serviceType"></span></a>					
									</span>
									<span data-bind="if: $root.reportTitle() != null && $root.reportTitle() != '' && ($root.office() == null || $root.office() == '' ) ">
										<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/' + $root.woCompletedServiceTypeListView() + '.aspx?FilterField1=Service%5Fx0020%5FType1&FilterValue1=' + serviceType + '&FilterField2=Admin_x0020_Staff&FilterValue2=' + $root.reportTitle()}"><span data-bind="text: serviceType"></span></a>					
									</span>
									<span data-bind="if: $root.reportTitle() != null && $root.reportTitle() != '' && ($root.office() != null && $root.office() != '' ) ">
										<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/' + $root.woCompletedServiceTypeListView() + '.aspx?FilterField1=Service%5Fx0020%5FType1&FilterValue1=' + serviceType + '&FilterField2=Requestor_x0020_Office1&FilterValue2=' + $root.reportTitle()}"><span data-bind="text: serviceType"></span></a>					
									</span>
								</td>
								<td><span data-bind="text: standard"></span></td>
								<td><span data-bind="text: completedWO "></span></td>
								<td><span data-bind="text: completedMeetingStandard"></span></td>
								<td><span data-bind="text: completedNotMeetingStandard"></span></td>
								<td><span data-bind="ToPercentage: completedPercMeetingStandard"></span></td>
								<td>
									<span data-bind="if: completedPercMeetingStandard >= $root.thresholdGreen() && completedWO > 0"><img src='../PublishingImages/KPIGreen.GIF'></img></span>
									<span data-bind="if: completedPercMeetingStandard < $root.thresholdGreen() && completedPercMeetingStandard >= $root.thresholdYellow() && completedWO > 0"><img src='../PublishingImages/KPIGold.GIF'></img></span>
									<span data-bind="if: completedPercMeetingStandard < $root.thresholdYellow() && completedWO > 0"><img src='../PublishingImages/KPIRed.GIF'></img></span>
								</td>
								<td nowrap style="vertical-align:top">
								
									<span class="lateIDContainers" data-bind="visible: lateIDs.length > 0, toggleClick: $data, toggleClass: 'collapsed', classContainer: '.lateID-item'">
										<span class="ui-icon ui-icon-search"></span>
										<a href="javascript:void(0)">View Late IDs</a>
									
										<!-- ko foreach: lateIDs-->
											<div class="lateID-item collapsed" >
												<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/AllItems.aspx?FilterField1=ID&FilterValue1=' + ID}">[<span data-bind="text: ID"></span> / <span data-bind="text: Days"></span>]</a>					
											</div>
										<!-- /ko -->
									</span>
									
								</td>
								<td data-bind="attr: {title: completedAvgTimeFloat}"><span data-bind="text: completedAvgTime"></span></td>
							</tr>
						</tbody>
					</table>
				
				
					<table id="tblActive" style="display:none" class="tablesorter report" data-bind="visible: arrItemsActive().length > 0 && filterDDView() == 'Active'">
						<thead>
							<tr valign="top">
								<th class="sorter-false" nowrap="nowrap" colspan="2">Total Active</th>
								<th class="sorter-false" nowrap="nowrap"><span id="activeTotalWO"></span></th>
								<th class="sorter-false" nowrap="nowrap"><span id="activeTotalLate"></span></th>
								<th class="sorter-false" nowrap="nowrap"><span id="activeTotalLatePer"></span></th>
								<th class="sorter-false" nowrap="nowrap">
									<span data-bind="if: $root.percMeetingStandard() >= $root.thresholdGreen() && $root.totalWO() > 0"><img src='../PublishingImages/KPIGreen.GIF'></img></span>
									<span data-bind="if: $root.percMeetingStandard() < $root.thresholdGreen() && $root.percMeetingStandard() >= $root.thresholdYellow() && $root.totalWO() > 0"><img src='../PublishingImages/KPIGold.GIF'></img></span>
									<span data-bind="if: $root.percMeetingStandard() < $root.thresholdYellow() && $root.totalWO() > 0"><img src='../PublishingImages/KPIRed.GIF'></img></span>
								</th>
							</tr>
							<tr valign="top">
								<th class="sorter-false" nowrap="nowrap"></th>
								<th class="sorter-false" nowrap="nowrap">Standard</th>
								<th class="sorter-false" nowrap="nowrap">Total Active</th>
								<th class="sorter-false" nowrap="nowrap">Late</th>
								<th class="sorter-false" nowrap="nowrap">%Late</th>
								<th class="sorter-false" nowrap="nowrap">KPI</th>
							</tr>
						</thead>
						<tbody id="fbody" data-bind="foreach: arrItemsActive">
							<tr>
								<td nowrap>									
									<span data-bind="if: $root.reportTitle() == null || $root.reportTitle() == ''">
										<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/' + $root.woActiveServiceTypeListView() + '.aspx?FilterField1=Service%5Fx0020%5FType1&FilterValue1=' + serviceType}"><span data-bind="text: serviceType"></span></a>					
									</span>
									<span data-bind="if: $root.reportTitle() != null && $root.reportTitle() != '' && ($root.office() == null || $root.office() == '' ) ">
										<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/' + $root.woActiveServiceTypeListView() + '.aspx?FilterField1=Service%5Fx0020%5FType1&FilterValue1=' + serviceType + '&FilterField2=Admin_x0020_Staff&FilterValue2=' + $root.reportTitle()}"><span data-bind="text: serviceType"></span></a>					
									</span>
									<span data-bind="if: $root.reportTitle() != null && $root.reportTitle() != '' && ($root.office() != null && $root.office() != '' ) ">
										<a target="_blank" data-bind="attr: { href: '../' + $root.woLibName() + '/Forms/' + $root.woActiveServiceTypeListView() + '.aspx?FilterField1=Service%5Fx0020%5FType1&FilterValue1=' + serviceType + '&FilterField2=Requestor_x0020_Office1&FilterValue2=' + $root.reportTitle()}"><span data-bind="text: serviceType"></span></a>					
									</span>
								</td>
								<td><span data-bind="text: standard"></span></td>
								<td><span data-bind="text: activeWO"></span></td>
								<td><span data-bind="text: activeLate"></span></td>
								<td><span data-bind="text: activeLatePerc"></span></td>
								<td>
									<span data-bind="if: activePercMeetingStandard >= $root.thresholdGreen() && activeWO > 0"><img src='../PublishingImages/KPIGreen.GIF'></img></span>
									<span data-bind="if: activePercMeetingStandard < $root.thresholdGreen() && activePercMeetingStandard >= $root.thresholdYellow() && activeWO > 0"><img src='../PublishingImages/KPIGold.GIF'></img></span>
									<span data-bind="if: activePercMeetingStandard < $root.thresholdYellow() && activeWO > 0"><img src='../PublishingImages/KPIRed.GIF'></img></span>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</table>
	</div>	
	
	<div>
		<a href="../Lists/Work%20Order%20Dashboard%20Feedback%20list/NewForm.aspx" target="_blank">Provide Feedback</a>
	</div>	
</div>




<link rel="stylesheet" type="text/css" href="/SiteAssets/css/jqueryui/1.11.3/themes/redmond/jquery-ui.min.css"  />
<link rel="stylesheet" type="text/css" href="/SiteAssets/css/tablesorter/style.css"  />
<link rel="stylesheet" type="text/css" href="/SiteAssets/css/WO_Reports.css"/>

<script type="text/javascript" src="/SiteAssets/js/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="/SiteAssets/js/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min.js"></script>
   
<script type="text/javascript" src="/SiteAssets/js/WO_Page_Report_DB_Main.js"></script>

