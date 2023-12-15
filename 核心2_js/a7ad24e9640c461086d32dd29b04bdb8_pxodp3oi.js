const reGetAmount = () => {
  debugger;
  var gridModel = viewModel.getGridModel("PayBillb");
  let rows = gridModel.getRows();
  let piArray = [];
  for (var i in rows) {
    let rowData = rows[i];
    let oriSum = rowData.oriSum;
    let rowDataStr = JSON.stringify(rowData);
    rowDataStr = rowDataStr.replace(/!/g, "_");
    let rowDataTemp = JSON.parse(rowDataStr);
    let cwPI = rowDataTemp.bodyItem_define1;
    let cwPIName = rowDataTemp.bodyItem_define1_name;
    let supplier = rowData.supplier;
    let supplierName = rowData.supplier_name;
    let isExist = false;
    if (!cwPI || !supplier) {
      continue;
    }
    for (var j in piArray) {
      let piObj = piArray[j];
      if (piObj.cwPI == cwPI && piObj.supplier == supplier) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      piArray.push({ cwPI: cwPI, supplier: supplier });
    }
  }
  if (piArray.length == 0) {
    cb.utils.alert("温馨提示！没有PI!", "info");
    return;
  }
  let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.calReceiptPayApi", { ReceiptPay: "payment", PIs: JSON.stringify(piArray) }, function (err, res) {}, viewModel, { async: false });
  let rstObj = rst.result;
  if (rstObj.rst) {
    let piList = rstObj.piArray;
    for (var i in rows) {
      let rowData = rows[i];
      let rowDataStr = JSON.stringify(rowData);
      rowDataStr = rowDataStr.replace(/!/g, "_");
      let rowDataTemp = JSON.parse(rowDataStr);
      let cwPI = rowDataTemp.bodyItem_define1;
      let supplier = rowData.supplier;
      for (var j in piList) {
        let piObj = piList[j];
        if (piObj.cwPI == cwPI && piObj.supplier == supplier) {
          if (rowData.item435fk == piObj.payAmount && rowData.item451gd == piObj.noAmount && rowData.item468ye == piObj.sumAmount) {
            break;
          }
          rowData.item435fk = piObj.payAmount;
          rowData.item451gd = piObj.noAmount; //未付金额
          rowData.item468ye = piObj.sumAmount;
          gridModel.setCellValue(i, "item435fk", piObj.payAmount);
          gridModel.setCellValue(i, "item451gd", piObj.noAmount);
          gridModel.setCellValue(i, "item468ye", piObj.sumAmount);
          break;
        }
      }
    }
  } else {
    cb.utils.alert("温馨提示！" + rstObj.msg, "error");
  }
};
viewModel.on("afterLoadData", function (data) {
  reGetAmount();
});
viewModel.get("PayBillb") &&
  viewModel.get("PayBillb").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("PayBillb");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("PayBillb").getRows()[rowIndex];
    if (cellName == "bodyItem!define1_name" || cellName == "supplier_name") {
      let rowDataStr = JSON.stringify(rowData);
      rowDataStr = rowDataStr.replace(/!/g, "_");
      let rowDataTemp = JSON.parse(rowDataStr);
      let cwPI = rowDataTemp.bodyItem_define1;
      let supplier = rowData.supplier;
      if (!cwPI || !supplier) {
        rowData.item435fk = 0;
        rowData.item451gd = 0; //未付金额
        rowData.item468ye = 0;
      }
      let rst = cb.rest.invokeFunction("GT3734AT5.APIFunc.calReceiptPayApi", { ReceiptPay: "payment", PIs: JSON.stringify([{ cwPI: cwPI, supplier: supplier }]) }, function (err, res) {}, viewModel, {
        async: false
      });
      let rstObj = rst.result;
      if (rstObj.rst) {
        let piList = rstObj.piArray;
        let piObj = piList[0];
        rowData.item435fk = piObj.payAmount;
        rowData.item451gd = piObj.noAmount; //未付金额
        rowData.item468ye = piObj.sumAmount;
        gridModel.updateRow(rowIndex, rowData);
      } else {
        cb.utils.alert("温馨提示！" + rstObj.msg, "error");
      }
    }
  });
viewModel.get("button35yi") &&
  viewModel.get("button35yi").on("click", function (data) {
    //获取已付金额--单击
    cb.utils.confirm(
      "您确定要重新获取已付金额？",
      () => {
        reGetAmount();
      },
      () => {
        return;
      }
    );
  });