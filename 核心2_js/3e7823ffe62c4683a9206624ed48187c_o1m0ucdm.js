viewModel.on("afterWorkflowBeforeQueryAsync", function (data) {
  debugger;
  cb.rest.invokeFunction("AT15E7378809680006.backOpenApiFunction.inserthtjl", { data }, function (err, res) {
    debugger;
  });
});
viewModel.get("defines!define9") &&
  viewModel.get("defines!define9").on("afterValueChange", function (data) {
    // 联合单位--值改变后
    cb.rest.invokeFunction(
      "ycContractManagement.apiEnd.staticapi",
      {},
      function (err, res) {
        console.log("进来了");
        console.log(err);
        console.log(res);
      },
      viewModel,
      { domainkey: "yourkeyHere" }
    );
  });
viewModel.get("button65re").setVisible(true);
viewModel.get("button68cc") &&
  viewModel.get("button68cc").on("click", function (data) {
    // 关联需求--单击
    viewModel.get("defines!define20").setValue("123");
  });
viewModel.get("button64jg") && viewModel.get("button64jg").on("click", function (data) {});
viewModel.get("defines!define20") &&
  viewModel.get("defines!define20").on("focus", function (data) {
    // 需求标识--得到焦点的回调
    let data2 = {
      billtype: "VoucherList", // 单据类型
      billno: "7eba45d6", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    cb.loader.runCommandLine("bill", data2, viewModel);
  });