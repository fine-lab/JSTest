viewModel.get("button1mg") &&
  viewModel.get("button1mg").on("click", function (data) {
    let row = viewModel.getGridModel().getRow(data.index);
    let isMinPacking = false;
    if (row.bzcpbs == row.bznhxyjbzcpbs) {
      isMinPacking = true;
    }
    let page = {
      billtype: "Voucher", // 单据类型
      billno: "6e8b687a", // 单据号
      params: {
        mode: "edit", // (编辑态、新增态、浏览态)
        configId: row.id,
        isMinPacking: isMinPacking
      }
    };
    cb.loader.runCommandLine("bill", page, viewModel);
  });