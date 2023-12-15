viewModel.get("membertradestockmanuallist_1516070438554828802") &&
  viewModel.get("membertradestockmanuallist_1516070438554828802").on("afterCellValueChange", function (data) {
    // 表格--单元格值改变后
    let name = data.cellName;
    let index = data.rowIndex;
    let value = data.value;
    let gridModel = viewModel.getGridModel();
    //修改了单价，计算总价
    if (name === "costprice") {
      let quantity_Debit = gridModel.getCellValue(index, "quantity_Debit");
      let money_Debit = quantity_Debit * value;
      if (!isNaN(money_Debit)) {
        gridModel.setCellValue(index, "money_Debit", money_Debit);
      }
    }
    //修改了总价，计算单价
    if (name === "money_Debit") {
      let quantity_Debit = gridModel.getCellValue(index, "quantity_Debit");
      let costprice = value / quantity_Debit;
      if (!isNaN(costprice)) {
        gridModel.setCellValue(index, "costprice", costprice);
      }
    }
    //修改了数量，计算总价
    if (name === "quantity_Debit") {
      let costprice = gridModel.getCellValue(index, "costprice");
      let money_Debit = costprice * value;
      if (!isNaN(money_Debit)) {
        gridModel.setCellValue(index, "money_Debit", money_Debit);
      }
    }
    //修改购买数量，计算购买金额
    if (name === "quantity_Credit") {
      let saleprice = gridModel.getCellValue(index, "saleprice");
      let salemoney = saleprice * value;
      if (!isNaN(salemoney)) {
        gridModel.setCellValue(index, "salemoney", salemoney);
      }
    }
    //修改了购买金额，计算购买单价
    if (name === "salemoney") {
      let quantity_Credit = gridModel.getCellValue(index, "quantity_Credit");
      let saleprice = value / quantity_Credit;
      if (!isNaN(saleprice)) {
        gridModel.setCellValue(index, "saleprice", saleprice);
      }
    }
    //修改了购买单价，计算购买金额
    if (name === "saleprice") {
      let quantity_Credit = gridModel.getCellValue(index, "quantity_Credit");
      let salemoney = quantity_Credit * value;
      if (!isNaN(salemoney)) {
        gridModel.setCellValue(index, "salemoney", salemoney);
      }
    }
    //填写了交易日期，计算所属年度
    if (name === "TradeDate") {
      const str = value.substring(0, 4);
      gridModel.setCellValue(index, "AccYear", str);
    }
  });
viewModel.on("customInit", function (data) {
  // 批量录入交易明细--页面初始化
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.get("baseOrg").on("afterValueChange", function (data) {
    console.log("组织值改变后事件触发");
    console.log("data", JSON.stringify(data));
  });
});