viewModel.on("afterDeleteRow", function (data) {
  //入参里没有能区分行属于哪个表的信息,所以用productId区分,有物料积分才进行操作
  if (data[0]["bodyItem!define12"] && data[0].productId) {
    //删除行后同步表头数据
    let totalPoing = viewModel.get("headItem!define55").getData();
    let totalVl = viewModel.get("headItem!define56").getData();
    for (var row of data) {
      let linePointSum = row["bodyItem!define13"];
      let lineVlSum = row["bodyItem!define15"];
      linePointSum && (totalPoing -= linePointSum);
      lineVlSum && (totalVl -= lineVlSum);
    }
    viewModel.get("headItem!define55").setValue(totalPoing);
    viewModel.get("headItem!define56").setValue(totalVl);
  }
});
viewModel.on("afterCopyrow", function (data) {
  //复制行时计算表头
  debugger;
  //入参里没有能区分行属于哪个表的信息,所以用productId区分,有物料积分才进行操作
  data = data.data.rowData.row;
  if ((data["bodyItem!define12"] || data["bodyItem!define14"]) && data.productId) {
    //复制行后同步表头数据
    let totalPoing = viewModel.get("headItem!define55").getData();
    let totalVl = viewModel.get("headItem!define56").getData();
    let linePointSum = Number(data["bodyItem!define13"]);
    let lineVlSum = Number(data["bodyItem!define15"]);
    linePointSum && (totalPoing += linePointSum);
    lineVlSum && (totalVl += lineVlSum);
    viewModel.get("headItem!define55").setValue(totalPoing);
    viewModel.get("headItem!define56").setValue(totalVl);
  }
});
viewModel.on("customInit", function (data) {
  var gridModel = viewModel.get("orderDetails");
  debugger;
  gridModel.on("afterCellValueChange", function (data) {
    var rowIndex = data.rowIndex;
    if (data.cellName == "realProductCode") {
      let c = data.value["define!define3"];
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define14", Number(c) / 500, true, false);
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
    if (data.cellName == "realProductCode") {
      //变更物料参照后清除积分和容积
      let linePointSum = viewModel.get("orderDetails").getCellValue(rowIndex, "bodyItem!define13");
      let lineVlSum = viewModel.get("orderDetails").getCellValue(rowIndex, "bodyItem!define15");
      let totalPoing = viewModel.get("headItem!define55").getData();
      let totalVl = viewModel.get("headItem!define56").getData();
      linePointSum && (totalPoing -= linePointSum);
      lineVlSum && (totalVl -= lineVlSum);
      viewModel.get("headItem!define55").setValue(totalPoing);
      viewModel.get("headItem!define56").setValue(totalVl);
      //重置行字段
      viewModel.get("orderDetails").setCellValue(rowIndex, "qty", 0, true, false);
      viewModel.get("orderDetails").setCellValue(rowIndex, "subQty", 0, true, false);
      viewModel.get("orderDetails").setCellValue(rowIndex, "priceQty", 0, true, false);
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define13", 0, true, false);
      viewModel.get("orderDetails").setCellValue(rowIndex, "bodyItem!define15", 0, true, false);
      debugger;
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
viewModel.get("headItem!define58") &&
  viewModel.get("headItem!define58").on("beforeValueChange", function (data) {
    // 新开门店--值改变前
    const value = viewModel.get("headItem!define57").getValue();
    console.log("猜猜我是:" + value);
  });
//行关闭后调用接口回写新开门店字段