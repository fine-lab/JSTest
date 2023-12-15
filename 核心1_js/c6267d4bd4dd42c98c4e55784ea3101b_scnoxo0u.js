viewModel.get("BranchAccrualForecastList") &&
  viewModel.get("BranchAccrualForecastList").on("afterCellValueChange", function (data) {
    //表格-BranchAccrualForecast--单元格值改变后
    const gridModel = viewModel.getGridModel();
    var rows = gridModel.getRows();
    var V_Total_RevenueQuota = 0;
    var V_RevenueFinish = 0;
    var V_RevenueForecast = 0;
    var V_GBUServiceQuota = 0;
    var V_GBUServiceFinish = 0;
    var V_GBUServiceForecast = 0;
    var V_TEST = 0;
    rows.forEach((row) => {
      debugger;
      V_Total_RevenueQuota += row.Revenue_Quota;
      V_RevenueFinish += row.Revenue_Finished;
      V_RevenueForecast += row.Revenue_Forecast;
      V_GBUServiceQuota += row.GBUService_Accrual_Quota;
      V_GBUServiceFinish += row.GBUService_Accrual_Finished;
      V_GBUServiceForecast += row.GBUService_Accrual_Forecast;
      V_TEST += row.TEST;
    });
    viewModel.get("Total_RevenueQuota").setValue(V_Total_RevenueQuota);
    viewModel.get("Revenue_Finished").setValue(V_RevenueFinish);
    viewModel.get("Revenue_Forecast").setValue(V_RevenueForecast);
    viewModel.get("GBUService_Accrual_Quota").setValue(V_GBUServiceQuota);
    viewModel.get("GBUService_Accrual_Finished").setValue(V_GBUServiceFinish);
    viewModel.get("GBUService_Accrual_Forcast").setValue(V_GBUServiceForecast);
  });