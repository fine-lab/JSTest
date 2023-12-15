function initExt(event) {
  let viewModel = this;
  let gridModel = viewModel.getGridModel();
  let gridEditRowModel = gridModel.getEditRowModel();
  let materialModel = gridEditRowModel.get("material_name");
  materialModel.on("beforeBrowse", function (event) {
    console.log("%cmaterialBrowse", "background:#EFE4B0;color:red", event);
    let index = gridModel.getFocusedRowIndex();
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    var org_id = gridModel.getCellValue(index, "purchaseOrg");
    condition.simpleVOs.push({
      field: "productApplyRange.orgId",
      op: "eq",
      value1: org_id
    });
    this.setFilter(condition);
  });
  gridModel.on("afterCellValueChange", function (event) {
    let { rowIndex, cellName, value, oldValue, childrenField } = event;
    if (cellName === "internalPrice" || cellName === "saleNum" || cellName === "saleAmount") {
      bodyCalculator(rowIndex, cellName, value);
    }
  });
  function bodyCalculator(rowIndex, cellName, value) {
    // 计算逻辑
    let gridModel = viewModel.getGridModel();
    if (cellName === "internalPrice") {
      let saleNum = gridModel.getCellValue(rowIndex, "saleNum");
      let saleAmount = value * saleNum || 0;
      gridModel.setCellValue(rowIndex, "saleAmount", saleAmount, false, false);
      gridModel.setCellValue(rowIndex, "purchaseAmount", saleAmount, false, false);
    } else if (cellName === "saleNum") {
      let salePrice = gridModel.getCellValue(rowIndex, "internalPrice");
      let saleAmount = value * salePrice;
      gridModel.setCellValue(rowIndex, "saleAmount", saleAmount, false, false);
      gridModel.setCellValue(rowIndex, "purchaseAmount", saleAmount, false, false);
      gridModel.setCellValue(rowIndex, "purchaseNum", value, false, false);
    }
  }
}