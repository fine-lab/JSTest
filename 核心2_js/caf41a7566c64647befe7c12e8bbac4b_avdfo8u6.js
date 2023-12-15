viewModel.on("afterLoadData", function (data) {
  // 维护套件--单击
  debugger;
  const value = viewModel.get("status").getValue();
  if (value == 0) {
    var allData = viewModel.getGridModel("orderDetails").getData();
    for (var i = 0; i < allData.length; i++) {
      var rowData = allData[i];
      var oldData = cb.rest.invokeFunction("SCMSA.jyApi.selectOldOrder", { id: rowData.originalOrderDetailId }, function (err, res) {}, viewModel, { async: false });
      var orlRes = oldData.result.orderDefineFreeRes[0].orderDetailDefineCharacter;
      viewModel.getGridModel("orderDetails").setCellValue(i, "bodyItem!define2", orlRes.bodyDefine2);
      viewModel.getGridModel("orderDetails").setCellValue(i, "bodyItem!define3", orlRes.bodyDefine3);
      viewModel.getGridModel("orderDetails").setCellValue(i, "bodyItem!define5", orlRes.bodyDefine5);
    }
  }
});
viewModel.on("customInit", function (data) {
  // 销售订单变更--页面初始化
});