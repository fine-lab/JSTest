viewModel.get("saleInvoiceDetails") &&
  viewModel.get("saleInvoiceDetails").on("afterCellValueChange", function (data) {
    //表体订单信息数据区--单元格值改变后
    let dt = viewModel.getGridModel("saleInvoiceDetails");
    console.log(data.cellName, "111"); //
    let value = data.value;
    //销售数量
    if (data.cellName == "priceQty" || data.cellName == "qty") {
      let saleInvoiceDetailDefineCharacter = dt.getCellValue(data.rowIndex, "saleInvoiceDetailDefineCharacter");
      setTimeout(() => {
        let zhdj = saleInvoiceDetailDefineCharacter.attrext110 || 0; //折后单价
        let qty = value || 0; //销售数量
        let zhje = (Number(zhdj) * qty).toFixed(2); //折后金额
        dt.setCellValue(data.rowIndex, "bodyFreeItem!define15", zhje);
        updataGauge();
      }, 500);
    }
  });
viewModel.get("saleInvoiceDetails").on("afterDeleteRows", function (rows) {
  updataGauge();
});
function updataGauge() {
  let zkhwsje = 0; //折扣后无税金额
  let zdzkje = 0; //整单折扣金额
  let amountun = 0; //表体无税金额
  let data = viewModel.getGridModel("saleInvoiceDetails").getAllData();
  data.map((v) => {
    let amount = v["bodyFreeItem!define15"] || 0;
    let oriMoney = v["oriMoney"] || 0;
    zkhwsje += Number(Number(amount).toFixed(2));
    amountun += Number(Number(oriMoney).toFixed(2));
  });
  zdzkje = (zkhwsje - amountun).toFixed(2);
  if (Number(zdzkje) < 0) {
    zdzkje = "0.00";
  }
  zkhwsje = zkhwsje.toFixed(2);
  viewModel.get("headFreeItem!define21").setValue(zkhwsje);
  viewModel.get("headFreeItem!define22").setValue(zdzkje);
}