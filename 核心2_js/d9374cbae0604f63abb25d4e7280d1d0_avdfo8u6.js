viewModel.getGridModel("orderDetails").on("afterCellValueChange", function (params) {
  var rowIndex = params.rowIndex;
  var cellName = params.cellName;
  if (cellName == "priceQty" || cellName == "subQty" || cellName == "qty") {
    var rowData = viewModel.getGridModel("orderDetails").getRow(rowIndex);
    var priceQty = rowData.priceQty;
    var qty = rowData.qty;
    const getAllData = viewModel.getAllData();
    var productId = rowData.productId;
    const date = viewModel.get("vouchdate").getValue();
    const customer = getAllData.agentId;
    var result = cb.rest.invokeFunction("SCMSA.jyApi.getDate", { productId: productId, customer: customer, reqDate: date }, function (err, res) {}, viewModel, { async: false });
    if (JSON.parse(result.result.resSql).data.result.length == 0) {
      var customerInfo = cb.rest.invokeFunction("SCMSA.jyApi.selectCusType", { reqId: customer }, function (err, res) {}, viewModel, { async: false });
      if (customerInfo.result.res.length != 0) {
        if (customerInfo.result.res[0].merchantCharacter.attrext1 != undefined) {
          var customerType = customerInfo.result.res[0].merchantCharacter.attrext1;
          result = cb.rest.invokeFunction("SCMSA.jyApi.getDate", { productId: productId, customerType: customerType, reqDate: date }, function (err, res) {}, viewModel, { async: false });
        }
      }
    }
    //计划内数量
    var plannedQuantity = 0;
    //计划外数量
    var unPlannedQuantity = 0;
    var availableQuantity = 0;
    var resSql = JSON.parse(result.result.resSql);
    if (cellName == "subQty") {
      qty = rowData.subQty * rowData.invExchRate;
    } else if (cellName == "priceQty") {
      qty = rowData.priceQty * rowData.invPriceExchRate;
    }
    if (resSql.code == "200" && resSql.data.result.length != 0) {
      plannedQuantity = JSON.parse(result.result.resSql).data.result[0].plannedAvailability;
      unPlannedQuantity = JSON.parse(result.result.resSql).data.result[0].overPlannedQuantity;
      //剩余可供量
      availableQuantity = JSON.parse(result.result.resSql).data.result[0].availableQuantity;
      if (availableQuantity == undefined) {
        availableQuantity = 0;
      }
      if (plannedQuantity == undefined) {
        plannedQuantity = 0;
      }
      if (unPlannedQuantity == undefined) {
        unPlannedQuantity = 0;
      }
      if (qty <= availableQuantity) {
        unPlannedQuantity = 0;
        plannedQuantity = qty;
        availableQuantity = availableQuantity - qty;
      } else {
        plannedQuantity = availableQuantity;
        unPlannedQuantity = qty - availableQuantity;
        availableQuantity = 0;
      }
      setTimeout(function () {
        viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define2", plannedQuantity);
        viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define3", unPlannedQuantity);
        viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define5", availableQuantity);
      }, 10);
    } else {
      setTimeout(function () {
        viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define2", 0);
        viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define3", priceQty);
        viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define5", 0);
      }, 10);
    }
  }
  if (cellName == "realProductCode") {
    setTimeout(function () {
      viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "priceQty", null);
      viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define2", null);
      viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define3", null);
      viewModel.getGridModel("orderDetails").setCellValue(rowIndex, "bodyItem!define5", null);
    }, 10);
  }
});
viewModel.on("afterUnaudit", function (args) {
  if (args.err == null) {
    setTimeout(function () {
      viewModel.execute("refresh");
    }, 10);
  }
});