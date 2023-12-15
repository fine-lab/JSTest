viewModel.on("customInit", function (data) {
  var gridModel = viewModel.get("orderDetails");
  gridModel.on("afterCellValueChange", function (data) {
    var rowIndex = data.rowIndex;
    if (data.cellName == "realProductCode") {
      let c = data.value["define!define3"];
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define14", Number(c), true, false);
      let d = data.value["define!define2"];
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define12", Number(d), true, false);
    }
    if (data.cellName == "returnQty" || data.cellName == "closedRowCount") {
      let qty = viewModel.get("orderDetails").getCellValue(rowIndex, "qty") === undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "qty");
      setJF(qty);
    }
    //选择数量，销售数量，还有计划数量时需要延时操作，解决本身自带的值改变事件的冲突。
    //销售数量，还有计划数量时需要根据换算率，得出数量。
    if (data.cellName == "qty") {
      let qty = viewModel.get("orderDetails").getCellValue(rowIndex, "qty") === undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "qty");
      setTimeout(() => setJFAndRJ(qty), 200);
    }
    if (data.cellName == "subQty") {
      let invExchRate = viewModel.get("orderDetails").getCellValue(rowIndex, "invExchRate") === undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "invExchRate");
      let qty = viewModel.get("orderDetails").getCellValue(rowIndex, "subQty") === undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "subQty") * invExchRate;
      setTimeout(() => setJFAndRJ(qty), 200);
    }
    if (data.cellName == "priceQty") {
      let invPriceExchRate = viewModel.get("orderDetails").getCellValue(rowIndex, "invPriceExchRate") === undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "invPriceExchRate");
      let qty = viewModel.get("orderDetails").getCellValue(rowIndex, "priceQty") === undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "priceQty") * invPriceExchRate;
      setTimeout(() => setJFAndRJ(qty), 200);
    }
    //设置积分和容积函数。
    function setJFAndRJ(qty) {
      let wljf = gridModel.getCellValue(rowIndex, "bodyItem!define12") == undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "bodyItem!define12");
      let wlrj = gridModel.getCellValue(rowIndex, "bodyItem!define14") == undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "bodyItem!define14");
      let returnQty = gridModel.getCellValue(rowIndex, "returnQty") == undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "returnQty");
      let closedRowCount = gridModel.getCellValue(rowIndex, "closedRowCount") == undefined ? 0 : viewModel.get("orderDetails").getCellValue(rowIndex, "closedRowCount");
      let wlhjf = wljf * (qty - returnQty - closedRowCount);
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define13", wlhjf);
      let wlhrj = wlrj * (qty - returnQty - closedRowCount);
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define15", wlhrj);
      let rows = gridModel.getRows();
      let sum = 0;
      let sumrj = 0;
      for (let i = 0; i < rows.length; i++) {
        let value = rows[i]["bodyItem!define13"];
        let valuerj = rows[i]["bodyItem!define15"];
        if (value !== undefined && value !== null && value !== "" && value !== 0) {
          sum += Number(value);
        }
        if (valuerj !== undefined && valuerj !== null && valuerj !== "" && valuerj !== 0) {
          sumrj += Number(valuerj);
        }
      }
      viewModel.get("headItem!define55").setValue(sum);
      viewModel.get("headItem!define56").setValue(sumrj);
    }
  });
});