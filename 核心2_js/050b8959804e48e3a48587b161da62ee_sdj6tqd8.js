viewModel.get("button22hi") &&
  viewModel.get("button22hi").on("click", function (data) {
    //按钮--单击
  });
viewModel.get("code_name") &&
  viewModel.get("code_name").on("afterValueChange", function (data) {
    viewModel.get("name").setValue(data.value.code);
  });
viewModel.get("chengbankazibiaoList") &&
  viewModel.get("chengbankazibiaoList").on("afterCellValueChange", function (data) {
    if (data.cellName == "product_name" && data.value.id) {
      let detail = viewModel.get("chengbankazibiaoList");
      detail.setCellValue(data.rowIndex, "productName", data.value.code, false, false);
      detail.setCellValue(data.rowIndex, "unit", data.value.unit_Code, false, false);
      detail.setCellValue(data.rowIndex, "unitName", data.value.unitName, false, false);
    }
  });