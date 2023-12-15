viewModel.get("dingdanhuoqufangshi_name") &&
  viewModel.get("dingdanhuoqufangshi_name").on("afterValueChange", function (data) {
    // 订单获取方式--值改变后
    inserRow();
  });
viewModel.get("hetongmingchen") &&
  viewModel.get("hetongmingchen").on("afterValueChange", function (data) {
    // 合同名称--值改变后
    inserRow();
  });
function inserRow() {
  debugger;
  viewModel.getGridModel("zhsrfqxxList").insertRow(1, { shourufenqibianhao: "23", qishiriqi: "2022-12-22" });
}