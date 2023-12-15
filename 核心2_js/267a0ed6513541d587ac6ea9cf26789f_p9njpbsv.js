// 保存前校验
viewModel.on("beforeSave", function (data) {
  console.log(data.data.data);
  debugger;
  if (viewModel.get("saleReturnStatus").getValue() == "SUBMITSALERETURN") {
    //单据状态开立态
    let dataSet = JSON.parse(data.data.data);
    let saleReturnDetails = JSON.parse(data.data.data)["saleReturnDetails"] ? JSON.parse(data.data.data)["saleReturnDetails"] : [];
    debugger;
    //获取当前的model
    let gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      saleReturnDetails[i]["bodyItem!define2"] = element["qty"];
      element["bodyItem!define2"] = element["qty"];
      gridModel.setCellValue(i, "bodyItem!define2", element["qty"], false, false); //
    }
    dataSet["saleReturnDetails"] = saleReturnDetails;
    data.data.data = JSON.stringify(dataSet);
  }
});