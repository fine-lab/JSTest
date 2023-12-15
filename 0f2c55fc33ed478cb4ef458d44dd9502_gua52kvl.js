console.log(`%c 采购执行单`, "color:orange; font-size: 32px; background: gray; border-radius: 6px; padding: 4px 8px;");
viewModel.on("customInit", function (data) {
  // 会员服务费结算政策规则详情--页面初始化
  viewModel.get("item57kd").on("updateCalculateResult", (data) => {
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