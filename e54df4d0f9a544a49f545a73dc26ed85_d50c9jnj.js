viewModel.on("afterLoadData", function (data) {
});
// 当页面状态是已审批或审批中的时候，编辑按钮不可编辑
viewModel.on("beforeEdit", function (data) {
  const verifystate = viewModel.get("verifystate").getValue();
  if (verifystate == 1) {
    cb.utils.alert("单据审批中，请撤回单据修改！");
    return false;
  }
});
viewModel.get("batch_price_detailList") &&
  viewModel.get("batch_price_detailList").on("afterCellValueChange", function (data) {
    // 表格-批次价格明细--单元格值改变前--回填剩余数量
    const { cellName, rowIndex, value } = data;
    const gridModel = viewModel.getGridModel();
    if (cellName == "patch_num") {
      const orderedNum = gridModel.getCellValue(rowIndex, "ordered_num");
      const remainNum = value - orderedNum;
      gridModel.setCellValue(rowIndex, "remain_num", remainNum);
      // 回填批次总数和剩余总数
      const tabelDatas = gridModel.getRows();
      let patchNumTotal = 0;
      let remainNumTotal = 0;
      tabelDatas.forEach((item, index) => {
        if (item.patch_num) {
          patchNumTotal = patchNumTotal + item.patch_num;
        }
        if (item.remain_num) {
          remainNumTotal = remainNumTotal + item.remain_num;
        }
      });
      viewModel.get("batch_total").setValue(patchNumTotal);
      viewModel.get("remain_total").setValue(remainNumTotal);
    }
    // 税率计算含税单价和无税单价
    // 无税=含税/（1+税率）
    if (cellName == "price_with_tax" || cellName == "tax_rate_name") {
      let priceWithTax = gridModel.getCellValue(rowIndex, "price_with_tax");
      if (priceWithTax) {
        priceWithTax = Number(priceWithTax).toFixed(6);
        gridModel.setCellValue(rowIndex, "price_with_tax", priceWithTax);
        const taxRace = gridModel.getCellValue(rowIndex, "tax_race");
        if (priceWithTax && taxRace != undefined) {
          const handel = taxRace ? taxRace / 100 : 0;
          let priceNoTax = priceWithTax / (1 + handel);
          gridModel.setCellValue(rowIndex, "price_no_tax", priceNoTax.toFixed(6));
        }
      }
    }
    // 无税单价和税率计算含税单价
    // 含税=无税*（1+税率）
    if (cellName == "price_no_tax" || cellName == "tax_rate_name") {
      let priceNoTax = gridModel.getCellValue(rowIndex, "price_no_tax");
      if (priceNoTax) {
        priceNoTax = Number(priceNoTax).toFixed(6);
        gridModel.setCellValue(rowIndex, "price_no_tax", priceNoTax);
        const taxRace = gridModel.getCellValue(rowIndex, "tax_race");
        if (priceNoTax && taxRace != undefined) {
          const handel = taxRace ? taxRace / 100 : 0;
          let priceWithTax = priceNoTax * (1 + handel);
          gridModel.setCellValue(rowIndex, "price_with_tax", priceWithTax.toFixed(6));
        }
      }
    }
  });
//相同物料的无税单价和税率不能完全相同
viewModel.on("beforeSave", function (args) {
  const gridModel = viewModel.getGridModel();
  const tabelDatas = gridModel.getRows();
  let flag = 0;
  for (let i = 0; i < tabelDatas.length; i++) {
    for (let j = i + 1; j < tabelDatas.length; j++) {
      if (tabelDatas[i].matieral_name === tabelDatas[j].matieral_name && tabelDatas[i].price_no_tax == tabelDatas[j].price_no_tax && tabelDatas[i].tax_rate_name === tabelDatas[j].tax_rate_name) {
        flag++;
      }
    }
  }
  if (flag > 0) {
    cb.utils.alert("请将同样价格的相同物料填入同一行");
    return false;
  }
  // 已下单数量>0时，批次数量不能小于已下单数量
  const patchArr = tabelDatas.filter((item, index) => {
    return item.patch_num < item.ordered_num;
  });
  if (patchArr.length > 0) {
    cb.utils.alert("批次数量不能小于已下单数量");
    return false;
  }
});
viewModel.getGridModel().on("beforeDeleteRows", function (data) {
  // 已下单数量>0时，不可删行
  const isCanDel = data.filter((item) => {
    return item.ordered_num > 0;
  });
  const verifystate = viewModel.get("verifystate").getValue();
  if (isCanDel.length > 0) {
    cb.utils.alert("当前数据中，包含已下单数量大于0，不可删除");
    return false;
  }
  if (verifystate == 1 || verifystate == 2) {
    cb.utils.alert("当前为审批状态，不可删除");
    return false;
  }
});
viewModel.getGridModel().on("afterDeleteRows", function (data) {
  const gridModel = viewModel.getGridModel();
  const tabelDatas = gridModel.getRows();
  let patchNumTotal = 0;
  let remainNumTotal = 0;
  tabelDatas.forEach((item, index) => {
    if (item.patch_num) {
      patchNumTotal = patchNumTotal + item.patch_num;
    }
    if (item.remain_num) {
      remainNumTotal = remainNumTotal + item.remain_num;
    }
  });
  viewModel.get("batch_total").setValue(patchNumTotal);
  viewModel.get("remain_total").setValue(remainNumTotal);
});
viewModel.get("batch_price_detailList") &&
  viewModel.get("batch_price_detailList").on("afterSetDataSource", function (data) {
    // 表格-批次价格明细--设置数据源后
    // 已下单数量>0时,单价不可修改
    var girdModel = viewModel.getGridModel();
    data.forEach((item, index) => {
      if (item.ordered_num > 0) {
        girdModel.setCellState(0, "price_no_tax", "readOnly", true);
      }
    });
  });
viewModel.on("afterLoadData", function (data) {
  // 批次价格表详情--页面初始化
  var { mode, billType, billNo, billData } = viewModel.getParams();
  var girdModel = viewModel.getGridModel();
  if (mode == "add") {
    girdModel.appendRow([]);
  }
});
viewModel.on("customInit", function (data) {
  // 批次价格表详情--页面初始化
});