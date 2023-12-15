viewModel.on("customInit", function (data) {
  let saleInvoiceDetails = viewModel.getGridModel("saleInvoiceDetails");
  viewModel.on("afterLoadData", function (data) {
    debugger;
    let rows = saleInvoiceDetails.getRows();
    for (let i = 0; i < rows.length; i++) {
      let source_main_id = rows[i].sourceid;
      let source_sub_id = rows[i].sourceautoid;
      cb.rest.invokeFunction("SCMSA.orderreturncheck.getSalesOutPrice", { id: source_sub_id }, function (err, res) {
        console.log(res.info);
        let info = res.info[0];
        let exp = /^[+-]?\d*(\.\d*)?(e[+-]?\d+)?$/;
        if (info.extend_change_total_price != "undefined" && exp.test(info.extend_change_total_price)) {
          let extend_change_price = info.extend_change_price;
          let extend_change_total_price = info.extend_change_total_price;
          let extend_change_diff_price = info.extend_change_diff_price;
          let oriSum = info.oriSum - extend_change_total_price; //发票含税金额
          let oriTaxUnitPrice = oriSum / info.qty; //发票含税单价
          saleInvoiceDetails.setCellValue(i, "oriSum", oriSum);
          saleInvoiceDetails.setCellValue(i, "natSum", oriSum);
          saleInvoiceDetails.setCellValue(i, "oriTaxUnitPrice", oriTaxUnitPrice);
          saleInvoiceDetails.setCellValue(i, "natTaxUnitPrice", oriTaxUnitPrice);
        }
      });
    }
  });
});