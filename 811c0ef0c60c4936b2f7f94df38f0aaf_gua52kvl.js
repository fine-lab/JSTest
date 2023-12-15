viewModel.on("customInit", function (data) {
  // 中央预定服务费结算政策规则详情--页面初始化
  viewModel.get("item70uj").on("updateCalculateResult", (data) => {
    gridModel.setCellValue(data.rowIndex, "calcType", data.formularValue);
    gridModel.setCellValue(data.rowIndex, "calcFormular", data.formularKey);
  });
});
const gridModel = viewModel.getGridModel();
gridModel.on("cellClick", ({ columnKey, rowIndex }) => {
  if (columnKey == "calcType") {
    const row = gridModel.getRow(rowIndex);
    viewModel.execute("showCalculateModal", {
      show: true,
      rowIndex,
      formularKey: row.calcType || "",
      formularValue: row.calcFormular || ""
    });
  }
});
viewModel.get("centerRuleListList") &&
  viewModel.get("centerRuleListList").getEditRowModel() &&
  viewModel.get("centerRuleListList").getEditRowModel().get("jmsmd.jms_name") &&
  viewModel
    .get("centerRuleListList")
    .getEditRowModel()
    .get("jmsmd.jms_name")
    .on("valueChange", function (data) {
      // 加盟商门店--值改变
    });