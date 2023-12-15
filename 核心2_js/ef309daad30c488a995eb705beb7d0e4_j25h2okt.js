viewModel.get("details") &&
  viewModel.get("details").on("afterCellValueChange", function (data) {
    //表体料品信息数据区--单元格值改变后
    debugger;
    if (data.cellName == "qty") {
      var grid = viewModel.getGridModel("details");
      var List = grid.__data.dataSource[data.rowIndex];
      // 优惠金额
      var price = List["bodyItem!define9"];
      // 返利金额
      var number = Number(List["bodyItem!define8"]);
      var Quantity = List.contactsQuantity;
      var countQty = List.qty;
      var priceQty = List.priceQty;
      // 重新计算的优惠金额
      let unitPrice = Math.round((price / priceQty) * 100) / 100;
      let totalPic = Math.round(unitPrice * countQty * 1000) / 1000;
      // 重新计算的返利金额
      let rebate = Math.round((number / priceQty) * 10000000) / 10000000;
      let rebateAmount = rebate * countQty;
      let row = data.rowIndex;
      setTimeout(function () {
        grid.setCellValue(row, "bodyItem!define9", totalPic);
        grid.setCellValue(row, "bodyItem!define8", rebateAmount);
      }, 500);
    }
  });