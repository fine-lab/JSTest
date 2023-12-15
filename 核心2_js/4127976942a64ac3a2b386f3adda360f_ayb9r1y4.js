viewModel.get("payment_detailsList") &&
  viewModel.get("payment_detailsList").getEditRowModel() &&
  viewModel.get("payment_detailsList").getEditRowModel().get("applicationType") &&
  viewModel
    .get("payment_detailsList")
    .getEditRowModel()
    .get("applicationType")
    .on("afterValueChange", function (data) {
      // 申请类型--值改变
      debugger;
    });
var gridModel = viewModel.getGridModel("payment_detailsList");
gridModel
  .getEditRowModel()
  .get("applicationType")
  .on("afterValueChange", function () {
    debugger;
  });