viewModel.get("button22ld").on("click", (value) => {
  const currentRowData = viewModel.getGridModel().getRow(value.index);
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "gshdApply", // 单据号
    params: {
      mode: "add", // 仅传mode即可
      hdId: currentRowData.id
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});