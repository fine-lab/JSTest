viewModel.get("pdm_contract_receipts_plan_1484084365418823685") &&
  viewModel.get("pdm_contract_receipts_plan_1484084365418823685").on("afterCellValueChange", function (data) {
    // 表格--单元格值改变后
    // 年度回款目标（税前）变化
    let targetAmountPre = viewModel.get("pdm_contract_receipts_plan_1484084365418823685").getCellValue(data.rowIndex, data.cellName);
    // 获取税率
    let taxRate = viewModel.get("pdm_contract_receipts_plan_1484084365418823685").getCellValue(data.rowIndex, "tax_rate");
    if (taxRate == null) {
      taxRate = 0.0;
    }
    viewModel.get("pdm_contract_receipts_plan_1484084365418823685").setCellValue(data.rowIndex, "year_target_amount", targetAmountPre * (1 - taxRate * 0.01), false, false);
  });