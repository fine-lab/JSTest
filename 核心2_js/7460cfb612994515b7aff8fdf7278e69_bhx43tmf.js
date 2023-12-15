viewModel.get("button24fe") &&
  viewModel.get("button24fe").on("click", function (data) {
    // 刷新--单击
  });
viewModel.get("button24we") &&
  viewModel.get("button24we").on("click", function (data) {
    // 刷新--单击
    cb.rest.invokeFunction("AT168516D809980006.backOpenApiFunction.test0202", {}, function (err, res) {
      console.log("刷新成功");
    });
  });
viewModel.get("button29oi") &&
  viewModel.get("button29oi").on("click", function (data) {
    // 提交--单击
    //获取对应的数据
    var dataValue = viewModel.getGridModel().getSelectedRows();
    var childValue = viewModel.getGridModel().get("childrenField");
    console.log(childValue);
    // 调用api
    cb.rest.invokeFunction("AT168516D809980006.backOpenApiFunction.postStatus", { dataValue: dataValue, childValue: childValue }, function (err, res) {
    });
  });
viewModel.on("customInit", function (data) {
  // 付款申请单hzy--页面初始化
});