viewModel.on("customInit", function (data) {
  // 结算价&变动成本调整单--页面初始化
  //页面加载事件,设置物料过滤条件
  viewModel.on("afterMount", function () {
    viewModel
      .getGridModel()
      .getEditRowModel()
      .get("material_name")
      .on("beforeBrowse", function (event) {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        let materialApplyRangeIds = [viewModel.get("saleOrg").getValue()];
        condition.simpleVOs.push({ field: "productApplyRange.orgId", op: "in", value1: materialApplyRangeIds }, { field: "detail.stopstatus", op: "eq", value1: 0 });
        this.setFilter(condition);
      });
    viewModel.getGridModel().on("afterCellValueChange", function (event) {
      let { rowIndex, cellName, value } = event;
      //清空物料，清空部分关联字段
      if (cellName == "material_name" && !value.id) {
        viewModel.getGridModel().setCellValue(rowIndex, "confirmPricePre", null, false, false);
        viewModel.getGridModel().setCellValue(rowIndex, "unitVariableCostPre", null, false, false);
        viewModel.getGridModel().setCellValue(rowIndex, "taxRaisePrice", null, false, false);
      }
    });
  });
});