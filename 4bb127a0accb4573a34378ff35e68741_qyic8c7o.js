viewModel.on("customInit", function (data) {
  // 客户信息确认--页面初始化
  viewModel.get("btnBatchSave").setVisible(false);
  viewModel.getGridModel().setPageSize(200);
});
viewModel.on("modeChange", function (e) {
  if (e == "edit") {
    viewModel.get("btnBatchSave").setVisible(true);
    viewModel.get("btnBatchPrintnow").setVisible(false);
    // 设置cell状态
    viewModel
      .getGridModel()
      .getAllData()
      .forEach((item, index) => {
        if (item.isCategory == 1) {
          viewModel.getGridModel().setCellState(index, "custCategoryBak", "readOnly", true);
        } else {
          viewModel.getGridModel().setCellState(index, "custCategoryBak", "bIsNull", false);
        }
        if (item.indIsTrue == 1) {
          viewModel.getGridModel().setCellState(index, "custIndedit2023", "readOnly", true);
        } else {
          viewModel.getGridModel().setCellState(index, "custIndedit2023", "bIsNull", false);
        }
      });
  } else {
    viewModel.get("btnBatchSave").setVisible(false);
    viewModel.get("btnBatchPrintnow").setVisible(true);
  }
});
viewModel.getGridModel().on("afterCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  if (cellName == "isCategory") {
    if (value.text == "是") {
      viewModel.getGridModel().setCellValue(rowIndex, "custCategoryBak", "");
      viewModel.getGridModel().setCellState(rowIndex, "custCategoryBak", "readOnly", true);
      viewModel.getGridModel().setCellState(rowIndex, "custCategoryBak", "bIsNull", true);
    } else {
      viewModel.getGridModel().setCellState(rowIndex, "custCategoryBak", "readOnly", false);
      viewModel.getGridModel().setCellState(rowIndex, "custCategoryBak", "bIsNull", false);
    }
  }
  if (cellName == "indIsTrue") {
    if (value.text == "是") {
      viewModel.getGridModel().setCellValue(rowIndex, "custIndedit2023", "");
      viewModel.getGridModel().setCellState(rowIndex, "custIndedit2023", "readOnly", true);
      viewModel.getGridModel().setCellState(rowIndex, "custIndedit2023", "bIsNull", true);
    } else {
      viewModel.getGridModel().setCellState(rowIndex, "custIndedit2023", "readOnly", false);
      viewModel.getGridModel().setCellState(rowIndex, "custIndedit2023", "bIsNull", false);
    }
  }
});
viewModel.get("btnBatchPrintnow") &&
  viewModel.get("btnBatchPrintnow").on("click", function (data) {
    // 提交确认--单击
    cb.rest.invokeFunction("AT16A11A2C17080008.API.setCustInfo", {}, function (err, res) {
      cb.utils.alert("数据已提交到总部。");
      viewModel.execute("refresh");
    });
  });
viewModel.on("customInit", function (data) {
  // 客户信息确认--页面初始化
});