viewModel.on("afterLoadData", function (data) {
  calcCurrentQty();
});
const calcCurrentQty = () => {
  let lpck = viewModel.get("lpck").getValue();
  let orgid = viewModel.get("org_id").getValue();
  if (!lpck || !orgid) {
    return;
  }
  var gridModel = viewModel.get("lplymxList");
  let rows = gridModel.getRows();
  for (var j in rows) {
    let rowData = rows[j];
    let wpmcid = rowData.wpmc;
    if (wpmcid == undefined || wpmcid == null || wpmcid == "") {
      continue;
    }
    let wprst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getCurrentQtyApi", { org: orgid, warehouse: lpck, product: wpmcid }, function (err, res) {}, viewModel, { async: false });
    let wprstObj = wprst.result;
    let currentqty = wprstObj.currentqty;
    rowData.item99lc = currentqty;
    gridModel.setCellValue(j, "item99lc", currentqty);
  }
};
viewModel.get("lplymxList") &&
  viewModel.get("lplymxList").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("lplymxList");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("lplymxList").getRows()[rowIndex];
    if (cellName == "wpmc_code") {
      let wpmcid = rowData.wpmc;
      let orgid = viewModel.get("org_id").getValue();
      let lpck = viewModel.get("lpck").getValue();
      let wprst = cb.rest.invokeFunction("GT3734AT5.APIFunc.getCurrentQtyApi", { org: orgid, warehouse: lpck, product: wpmcid }, function (err, res) {}, viewModel, { async: false });
      let wprstObj = wprst.result;
      let currentqty = 0;
      currentqty = wprstObj.currentqty;
      rowData.item99lc = currentqty;
      gridModel.updateRow(rowIndex, rowData);
    }
  });
viewModel.get("lpck_name") &&
  viewModel.get("lpck_name").on("afterValueChange", function (data) {
    // 礼品仓库--值改变后
    calcCurrentQty();
  });