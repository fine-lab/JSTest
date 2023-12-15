viewModel.get("ytenant") &&
  viewModel.get("buyerTenant") &&
  viewModel.on("afterLoadData", function (data) {
    // 报价--加载数据后
    let buyerTenant = data.buyerTenant;
    let ytenant = data.ytenant;
    //租户和供应商租户相等隐藏报价附件
    if (ytenant === buyerTenant && viewModel.get("detailList") && viewModel.get("detailList").getEditRowModel().get("detailFile")) {
      viewModel.get("detailList").setColumnState("detailFile", "visible", false);
    } else {
      viewModel.get("detailList").setColumnState("detailFile", "visible", true);
    }
    //新增清空金额数据
    if ("add" === viewModel.originalParams.mode) {
      let rows = viewModel.get("detailList").getRows();
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        viewModel.get("detailList").setCellValue(i, "price", 0);
        viewModel.get("detailList").setCellValue(i, "noTaxPrice", 0);
        viewModel.get("detailList").setCellValue(i, "totalPrice", 0);
        viewModel.get("detailList").setCellValue(i, "noTaxMoney", 0);
      }
    }
    viewModel.get("detailList").setColumnState("totalPrice", "bCanModify", true);
  });
viewModel.get("detailList")?.on("afterCellValueChange", function (data) {
  if ("taxrate" === data.cellName || "amount" === data.cellName || "totalPrice" === data.cellName) {
    let taxrate = viewModel.get("detailList").getCellValue(data.rowIndex, "taxrate"); //税率
    let totalPrice = viewModel.get("detailList").getCellValue(data.rowIndex, "totalPrice"); //含税金额(现金)
    let amount = viewModel.get("detailList").getCellValue(data.rowIndex, "amount"); //计价数量
    let noTaxMoney = totalPrice / (1 + Number(taxrate) / 100); //无税金额(现金)
    let price = totalPrice / amount; //含税单价(现金)
    let noTaxPrice = noTaxMoney / amount; //无税单价(现金)
    viewModel.get("detailList").setCellValue(data.rowIndex, "noTaxMoney", noTaxMoney);
    viewModel.get("detailList").setCellValue(data.rowIndex, "price", price);
    viewModel.get("detailList").setCellValue(data.rowIndex, "noTaxPrice", noTaxPrice);
  }
});