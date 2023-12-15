viewModel.get("details") &&
  viewModel.get("details").on("afterCellValueChange", function (data) {
    //表体料品信息数据区--单元格值改变后
    debugger;
    if (data.cellName == "qty") {
      var grid = viewModel.getGridModel("details");
      var List = grid.__data.dataSource[data.rowIndex];
      // 优惠金额
      var price = List["bodyItem!define7"];
      // 返利金额
      var number = Number(List["bodyItem!define9"]);
      var Quantity = List.contactsQuantity;
      var countQty = List.qty;
      var priceQty = List.priceQty;
      var invExchRate = List.invExchRate;
      var sum = priceQty * invExchRate;
      var row = data.rowIndex;
      // 重新计算的优惠金额
      var unitPrice = price / sum;
      var totalPic = Math.round(unitPrice * countQty * 1000) / 1000;
      // 重新计算的返利金额
      var rebate = number / sum;
      var rebateAmount = Math.round(rebate * countQty * 1000) / 1000;
      setTimeout(function () {
        grid.setCellValue(row, "bodyItem!define7", totalPic);
        grid.setCellValue(row, "bodyItem!define9", rebateAmount);
      }, 500);
    }
  });