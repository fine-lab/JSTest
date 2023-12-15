viewModel.get("po_pomain_1690368990687789063") &&
  viewModel.get("po_pomain_1690368990687789063").on("afterSetDataSource", function (data) {
    // 采购订单主表--设置数据源后
    debugger;
    let po_pomain = viewModel.getGridModel("po_pomain_1690368990687789063");
    let dels = [];
    for (var i = 0; i < po_pomain.getRows().length; i++) {
      let ReceiptNum = parseFloat(po_pomain.getCellValue(i, "ReceiptNum") || 0); //累计入库
      let PoNum = parseFloat(po_pomain.getCellValue(i, "PoNum") || 0); //累计采购
      if (ReceiptNum >= PoNum) {
        dels.push(i);
      }
    }
    po_pomain.deleteRows(dels);
  });