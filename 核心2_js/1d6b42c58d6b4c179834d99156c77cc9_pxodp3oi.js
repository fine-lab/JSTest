viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").on("afterCellValueChange", function (data) {
    console.log("77777");
    let gridModel = viewModel.get("orderDetails");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("orderDetails").getRows()[rowIndex];
    let subQty = rowData.subQty; //销售数量
    subQty = subQty == null || subQty == "" ? 0 : subQty;
    if (cellName == "oriSum") {
      let oriSum = data.value; //含税金额;
      oriSum = oriSum == null || oriSum == "" ? 0 : oriSum;
      rowData.oriSum = oriSum;
      gridModel.updateRow(rowIndex, rowData);
      calSumCBAmount(gridModel);
    }
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
    console.log(sumAmount, 555555555555555555555);
  }
  viewModel.get("headFreeItem!define14").setValue(sumAmount);
}