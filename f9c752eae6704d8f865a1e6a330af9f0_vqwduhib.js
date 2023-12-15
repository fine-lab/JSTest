viewModel.get("flzc_1721577829263474694") &&
  viewModel.get("flzc_1721577829263474694").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    debugger;
    for (var i = 0; i < data.length; i++) {
      let flzc = data[i];
      let value = "--";
      let res = cb.rest.invokeFunction("f2e61bec7a8047d888df350d55f013e4", { pss: flzc.flzcsList_merchant, productId: flzc.flzcsList_product }, null, viewModel, { async: false });
      dw = res.result.dw;
      kdj = res.result.kdj;
      xsjj = res.result.xsjj;
      viewModel.get("flzc_1721577829263474694").setCellValue(i, "item81zd", dw);
      viewModel.get("flzc_1721577829263474694").setCellValue(i, "item83yc", kdj);
      viewModel.get("flzc_1721577829263474694").setCellValue(i, "item86yf", xsjj);
    }
    console.log(JSON.stringify(data));
  });