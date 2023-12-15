viewModel.get("orderNo_btn") &&
  viewModel.get("orderNo_btn").on("afterValueChange", function (data) {
    //工程单编号--值改变后
    debugger;
    let supplierCode = null;
    let gridModel = viewModel.get("quotationDetailsList");
    let rows = gridModel.getRows(); //
    const value = viewModel.get("orderNo_btn").getValue();
    if (cb.utils.isEmpty(value)) {
      clearKitRow();
      return false;
    }
    if (!cb.utils.isEmpty(rows)) {
      clearKitRow();
    }
    let result = cb.rest.invokeFunction(
      "AT187C938409200001.API.getEnOrder",
      { data: value },
      function (err, res) {
        if (err != undefined || err != null) {
          cb.utils.alert("获取套餐异常");
          return false;
        }
      },
      viewModel,
      { async: false }
    );
    result.result.res.forEach((project) => {
      gridModel.appendRow(project);
      supplierCode = project.supplierCode;
    });
    if (!cb.utils.isEmpty(supplierCode)) {
      viewModel.get("supplierCode").setValue(supplierCode);
    }
  });
//清楚所有套餐行
const clearKitRow = () => {
  let gridModel = viewModel.get("quotationDetailsList");
  let rows = gridModel.getRows(); //获取表格所有的行
  let deleteRowIndexes = [];
  rows.forEach((row, index) => {
    deleteRowIndexes.push(index);
  });
  gridModel.deleteRows(deleteRowIndexes);
};