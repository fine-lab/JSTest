viewModel.get("nhBusinessType") &&
  viewModel.get("nhBusinessType").on("afterValueChange", function (data) {
    // 业务类型--值改变后
    debugger;
    if (data.value.value === "1") {
      viewModel.get("nhUsing").setVisible(false);
      viewModel.get("nhleavingReasons").setVisible(true);
      viewModel.get("nhContractPersonnel").setVisible(true);
      viewModel.get("nhDestination_name").setVisible(true);
      viewModel.get("nhDeparture").setVisible(true);
      viewModel.get("nhDepartureEnd").setVisible(true);
      viewModel.get("nhIdleDays").setVisible(true);
      viewModel.get("nhmemo").setVisible(true);
      viewModel.get("nhUsing").__data.bIsNull = true;
    } else {
      viewModel.get("nhleavingReasons").setVisible(false);
      viewModel.get("nhContractPersonnel").setVisible(false);
      viewModel.get("nhDestination_name").setVisible(false);
      viewModel.get("nhDeparture").setVisible(false);
      viewModel.get("nhDepartureEnd").setVisible(false);
      viewModel.get("nhIdleDays").setVisible(false);
      viewModel.get("nhUsing").setVisible(true);
      viewModel.get("nhmemo").setVisible(false);
      viewModel.get("nhleavingReasons").__data.bIsNull = true;
      viewModel.get("nhContractPersonnel").__data.bIsNull = true;
      viewModel.get("nhDestination_name").__data.bIsNull = true;
      viewModel.get("nhDeparture").__data.bIsNull = true;
      viewModel.get("nhDepartureEnd").__data.bIsNull = true;
      viewModel.get("nhIdleDays").__data.bIsNull = true;
    }
  });
viewModel.get("nhBusinessType") &&
  viewModel.get("nhBusinessType").on("onAfterSetDataSource", function (data) {
    // 业务类型--设置数据源后
    debugger;
    if (data.value.value === "1") {
      viewModel.get("nhUsing").setVisible(false);
      viewModel.get("nhleavingReasons").setVisible(true);
      viewModel.get("nhContractPersonnel").setVisible(true);
      viewModel.get("nhDestination_name").setVisible(true);
      viewModel.get("nhDeparture").setVisible(true);
      viewModel.get("nhDepartureEnd").setVisible(true);
      viewModel.get("nhIdleDays").setVisible(true);
      viewModel.get("nhmemo").setVisible(true);
      viewModel.get("nhUsing").__data.bIsNull = true;
    } else {
      viewModel.get("nhleavingReasons").setVisible(false);
      viewModel.get("nhContractPersonnel").setVisible(false);
      viewModel.get("nhDestination_name").setVisible(false);
      viewModel.get("nhDeparture").setVisible(false);
      viewModel.get("nhDepartureEnd").setVisible(false);
      viewModel.get("nhIdleDays").setVisible(false);
      viewModel.get("nhUsing").setVisible(true);
      viewModel.get("nhmemo").setVisible(false);
      viewModel.get("nhleavingReasons").__data.bIsNull = true;
      viewModel.get("nhContractPersonnel").__data.bIsNull = true;
      viewModel.get("nhDestination_name").__data.bIsNull = true;
      viewModel.get("nhDeparture").__data.bIsNull = true;
      viewModel.get("nhDepartureEnd").__data.bIsNull = true;
      viewModel.get("nhIdleDays").__data.bIsNull = true;
    }
  });
viewModel.on("customInit", function (data) {
  // 出国境办理详情--页面初始化
  viewModel.on("afterMount", function (data) {
    // 隐藏一个主表字段
    debugger;
    viewModel.get("btnBizFlowPush").setVisible(false);
    viewModel.get("btnModelPreview").setVisible(false);
    let nhBusinessType = viewModel.get("nhBusinessType").getData();
    if (nhBusinessType === "1") {
      viewModel.get("nhUsing").setVisible(false);
      viewModel.get("nhleavingReasons").setVisible(true);
      viewModel.get("nhContractPersonnel").setVisible(true);
      viewModel.get("nhDestination_name").setVisible(true);
      viewModel.get("nhDeparture").setVisible(true);
      viewModel.get("nhDepartureEnd").setVisible(true);
      viewModel.get("nhIdleDays").setVisible(true);
      viewModel.get("nhmemo").setVisible(true);
      viewModel.get("nhUsing").__data.bIsNull = true;
    } else {
      viewModel.get("nhleavingReasons").setVisible(false);
      viewModel.get("nhContractPersonnel").setVisible(false);
      viewModel.get("nhDestination_name").setVisible(false);
      viewModel.get("nhDeparture").setVisible(false);
      viewModel.get("nhDepartureEnd").setVisible(false);
      viewModel.get("nhIdleDays").setVisible(false);
      viewModel.get("nhUsing").setVisible(true);
      viewModel.get("nhmemo").setVisible(false);
      viewModel.get("nhleavingReasons").__data.bIsNull = true;
      viewModel.get("nhContractPersonnel").__data.bIsNull = true;
      viewModel.get("nhDestination_name").__data.bIsNull = true;
      viewModel.get("nhDeparture").__data.bIsNull = true;
      viewModel.get("nhDepartureEnd").__data.bIsNull = true;
      viewModel.get("nhIdleDays").__data.bIsNull = true;
    }
  });
});