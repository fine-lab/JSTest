viewModel.get("button25ye") &&
  viewModel.get("button25ye").on("click", function (event) {
    debugger;
    //获取选中行的行号
    var line = event.index;
    //获取选中行数据信息
    var shoujixinghao = viewModel.getGridModel().getRow(line).id;
    //传递给被打开页面的数据信息
    var data = {
      billtype: "VoucherList", // 单据类型
      billno: "4806bd9b", // 单据号
      params: {
        mode: "browse" // (编辑态edit、新增态add、浏览态browse)
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });
viewModel.get("button25ye") &&
  viewModel.get("button25ye").on("click", function (data) {
    // 弹出模态框--单击
  });