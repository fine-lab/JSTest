viewModel.on("customInit", function (data) {
  // 应用运维详情--页面初始化
  var viewModel = this;
  var gridModel = viewModel.get("application_deployList");
  debugger;
  console.log(gridModel);
});
viewModel.get("application_pm_ops_name") &&
  viewModel.get("application_pm_ops_name").on("beforeBrowse", function (data) {
    // 实现选择用户的组织id过滤
    data.externalData = { serviceCode: "", org_id: "youridHere", dept_id: "youridHere" };
  });
viewModel.get("application_deployList") &&
  viewModel.get("application_deployList").getEditRowModel() &&
  viewModel.get("application_deployList").getEditRowModel().get("deploy_mode") &&
  viewModel
    .get("application_deployList")
    .getEditRowModel()
    .get("deploy_mode")
    .on("blur", function (data) {
      // 部署方式--值改变
      debugger;
      console.log(data);
    });
viewModel.get("application_deployList") &&
  viewModel.get("application_deployList").getEditRowModel() &&
  viewModel.get("application_deployList").getEditRowModel().get("deploy_mode") &&
  viewModel
    .get("application_deployList")
    .getEditRowModel()
    .get("deploy_mode")
    .on("afterValueChange", function (data) {
      // 部署方式--值改变
      debugger;
      console.log(data);
    });
viewModel.get("application_deployList") &&
  viewModel.get("application_deployList").on("afterCellValueChange", function (data) {
    // 表格-部署信息--单元格值改变后
    debugger;
    console.log(data);
  });