viewModel.get("dctl1681892370636_1").on("click", () => {
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "gshdApply", // 单据号
    params: {
      mode: "add" // 仅传mode即可
    }
  };
  cb.loader.runCommandLine("bill", data, viewModel);
});