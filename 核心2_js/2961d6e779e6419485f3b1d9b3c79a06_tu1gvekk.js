viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720") &&
  viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720").on("afterCellValueChange", function (data) {
    // 表格--单元格值改变后
    // 预测税前金额
    if (data.cellName === "expect_back_amount_pre") {
      let expectPreAmount = viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720").getCellValue(data.rowIndex, data.cellName);
      let taxRate = viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720").getCellValue(data.rowIndex, "tax_rate_value");
      if (taxRate != null) {
        viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720").setCellValue(data.rowIndex, "expect_back_amount_after", expectPreAmount * (1 - taxRate * 0.01), false, false);
      }
    } else if (data.cellName === "expect_back_date") {
      // 预计回款日期
      let backDate = viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720").getCellValue(data.rowIndex, "expect_back_date");
      let backMonth = backDate.substr(5, 2);
      let month = Number(backMonth);
      viewModel.get("hn_pdm_receipts_plan_exec_1491642356792819720").setCellValue(data.rowIndex, "expect_back_month", month, false, false);
    }
  });