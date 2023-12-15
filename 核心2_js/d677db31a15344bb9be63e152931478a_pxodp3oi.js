viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("orderDetails");
    console.log(gridModel, 2222221111111111111111111);
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    console.log(cellName, 11111111111111111111111111);
    let rowData = viewModel.get("orderDetails").getRows()[rowIndex];
    let subQty = rowData.subQty; //销售数量
    subQty = subQty == null || subQty == "" ? 0 : subQty;
    if (cellName == "oriSum") {
      let oriSum = data.value; //含税金额;
      console.log(oriSum, 11111111111111111111111111);
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
    let productName = rowDatas[idx].productName;
    if (productName != undefined && productName != "" && productName.includes("海运费/保险")) {
      continue;
    }
    sumAmount = sumAmount + rowDatas[idx].oriSum;
  }
  viewModel.get("headFreeItem!define14").setValue(sumAmount);
}