var billData = viewModel.getParams().billData;
var orders = viewModel.getParams().orders;
var sum = viewModel.getParams().sum;
var vendor = billData.vendor;
viewModel.get("button22hf") &&
  viewModel.get("button22hf").on("click", function (data) {
    // 确认--单击
    var batchData = viewModel.getGridModel().getSelectedRows();
    cb.utils.loadingControl.start();
    debugger;
    cb.rest.invokeFunction(
      "PU.backApiFunc.getBatchPrice",
      {
        orders,
        sum,
        billData,
        batchData
      },
      function (err, res) {
        cb.utils.loadingControl.end();
        if (err) {
          cb.utils.alert(err.message, "error");
        } else {
          let parentViewModel = viewModel.getCache("parentViewModel");
          parentViewModel.execute("refresh");
          viewModel.communication({ type: "modal", payload: { data: false } });
        }
      }
    );
  });
viewModel.get("button26nh") &&
  viewModel.get("button26nh").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
// 给查询区设置过滤条件并过滤
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    filtervm.get("supplier").getFromModel().setValue(vendor);
  });
});