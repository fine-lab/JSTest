let datars = {
  billtype: "VoucherList", // 单据类型
  billno: "2d2af6f7", // 单据号
  domainKey: "yourKeyHere",
  params: {
    mode: "edit" // (编辑态edit、新增态add、浏览态browse)
  }
};
//打开一个单据，并在当前页面显示
cb.loader.runCommandLine("bill", datars, viewModel);