viewModel.on("afterLoadData", function (data) {
  // 报价--加载数据后   item197wh
  let taxTotalPrices = viewModel.get("clarifyMaterialOffers").getCellValue(data.rowIndex, "taxTotalPrices"); //含税金额(现金)
  viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item197bb", total);
  viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item210vc", total);
  viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item197lf", total);
  viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item197wh", total);
});
viewModel.get("clarifyMaterialOffers") &&
  viewModel.get("clarifyMaterialOffers").on("afterCellValueChange", function (data) {
    if ("item197bb" === data.cellName || "item210vc" === data.cellName || "item197lf" === data.cellName || "item197wh" === data.cellName) {
      let rate = viewModel.get("clarifyMaterialOffers").getCellValue(data.rowIndex, "rate"); //税率
      let taxTotalPrices = viewModel.get("clarifyMaterialOffers").getCellValue(data.rowIndex, data.cellName); //含税金额(现金)
      let bidAmount = viewModel.get("clarifyMaterialOffers").getCellValue(data.rowIndex, "bidAmount"); //计价数量
      let totalPrices = taxTotalPrices / (1 + Number(rate) / 100); //无税金额(现金)
      let taxPrice = taxTotalPrices / bidAmount; //含税单价(现金)
      let notaxPrice = totalPrices / bidAmount; //无税单价(现金)
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "totalPrices", totalPrices);
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "taxPrice", taxPrice);
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "taxTotalPrices", taxTotalPrices);
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "notaxPrice", notaxPrice);
    }
    if ("notaxPrice" === data.cellName || "taxPrice" === data.cellName || "rate" === data.cellName || "bidAmount" === data.cellName || "taxTotalPrices" === data.cellName) {
      let total = viewModel.get("clarifyMaterialOffers").getCellValue(data.rowIndex, "taxTotalPrices"); //含税金额(现金)
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item197bb", total);
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item210vc", total);
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item197lf", total);
      viewModel.get("clarifyMaterialOffers").setCellValue(data.rowIndex, "item197wh", total);
    }
  }); // init 2023/5/23 14:14:24