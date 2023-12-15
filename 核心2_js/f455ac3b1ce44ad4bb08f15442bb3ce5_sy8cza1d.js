viewModel.get("purchaseOrders").on("afterCellValueChange", function (data) {
  //物料编码--值改变
  if (data.cellName == "product_cCode") {
    let productId = data.value.id;
    let result = cb.rest.invokeFunction("PU.backApi.getFjl", { productId: productId }, function (err, res) {}, viewModel, { async: false });
    let res = result.result.res;
    let fjlArr = [];
    res.forEach((item, index) => {
      fjlArr.push("辅计量名称：" + item.assistUnit_name + " 换算率：" + item.mainUnitCount);
    });
    let fjlStr = fjlArr.join(";");
    debugger;
    viewModel.get("purchaseOrders").setCellValue(data.rowIndex, "extend_fjl", fjlStr);
  }
});