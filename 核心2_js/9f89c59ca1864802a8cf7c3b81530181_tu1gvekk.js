viewModel.get("hn_pdm_receipts_plan_exec_1491514332400320521") &&
  viewModel.get("hn_pdm_receipts_plan_exec_1491514332400320521").on("afterCellValueChange", function (data) {
    // 表格--单元格值改变后
    // 实际回款金额（税前）--值改变
    let actAfterAmount = viewModel.get("hn_pdm_receipts_plan_exec_1491514332400320521").getCellValue(data.rowIndex, data.cellName);
    let taxRate = viewModel.get("hn_pdm_receipts_plan_exec_1491514332400320521").getCellValue(data.rowIndex, "tax_rate_value");
    if (taxRate != null) {
      viewModel.get("hn_pdm_receipts_plan_exec_1491514332400320521").setCellValue(data.rowIndex, "act_after_receipted_amount", actAfterAmount * (1 - taxRate * 0.01), false, false);
    }
  });