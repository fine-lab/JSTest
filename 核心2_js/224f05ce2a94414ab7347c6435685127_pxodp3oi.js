viewModel.on("afterBuildCode", function (args) {
  let gridModel = viewModel.get("orderDetails");
  calSumCBAmount(gridModel);
});
function calSumCBAmount(gridModel) {
  //合计
  let rowDatas = gridModel.getRows();
  let sumAmount = 0;
  for (var idx in rowDatas) {
    //费用类不用加入
    let extendwlfl_name = rowDatas[idx].extendwlfl_name;
    if (extendwlfl_name != undefined && extendwlfl_name != "" && extendwlfl_name.includes("费用")) {
      continue;
    }
    sumAmount = sumAmount + rowDatas[idx].oriSum;
  }
  viewModel.get("headFreeItem!define14").setValue(sumAmount);
}
viewModel.on("afterLoadData", function (data) {
  getFirstReceive(0);
});
viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").on("afterCellValueChange", function (data) {
    let cellName = data.cellName;
    if (cellName == "bodyItem!define1_name") {
      getFirstReceive(1);
    }
  });
function getFirstReceive(idx) {
  debugger;
  let id = viewModel.get("id").getValue();
  if (!id) {
  }
  let extendFReceiveDate = viewModel.get("extendFReceiveDate").getValue();
  if (extendFReceiveDate && idx == 0) {
    return;
  }
  let gridModel = viewModel.get("orderDetails");
  let rowDatas = gridModel.getRows();
  if (rowDatas != null && rowDatas.length > 0) {
    let rowData = rowDatas[0];
    let rowStr = JSON.stringify(rowData);
    rowStr = rowStr.replace(/!/g, "_");
    rowData = JSON.parse(rowStr);
    let pi = rowData.bodyItem_define1;
    if (pi) {
      let rest = cb.rest.invokeFunction("SCMSA.serviceAPIFunc.getSaleBFRDate", { pi: pi, id: id }, function (err, res) {}, viewModel, { async: false });
      if (rest.result.rst) {
        let vouchdate = rest.result.vouchdate;
        viewModel.get("extendFReceiveDate").setValue(vouchdate);
        extendFReceiveDate = vouchdate;
      } else {
        //没有查到-默认同单据日期
      }
    }
  }
  if (!extendFReceiveDate) {
    let vouchdate = viewModel.get("vouchdate").getValue();
    viewModel.get("extendFReceiveDate").setValue(vouchdate);
  }
}
viewModel.get("vouchdate") &&
  viewModel.get("vouchdate").on("afterValueChange", function (data) {
    // 值改变后
    setSelfYwy();
  });
function setSelfYwy() {
  let vouchdate = viewModel.get("vouchdate").getValue();
  viewModel.get("extendFReceiveDate").setValue(vouchdate);
}