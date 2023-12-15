viewModel.on("customInit", function (data) {
  // 业务流一详情--页面初始化
  viewModel.get("button25cd").on("click", function (data) {
    // 测试--单击
    let gridModel = viewModel.getGridModel();
    gridModel.deleteAllRows();
    let rowData = {
      new1: 111,
      new2: 222,
      zxd1: "2414200491004672"
    };
    gridModel.appendRow(rowData);
  });
});
viewModel.on("afterLoadData", function (data) {
  viewModel.get("new1").setValue("125");
  viewModel.get("new1").execute("afterValueChange");
});
viewModel.get("new1").on("afterValueChange", function (args) {
  cb.utils.alert("出发了");
});