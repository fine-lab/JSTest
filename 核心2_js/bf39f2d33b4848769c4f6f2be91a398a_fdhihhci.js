viewModel.get("btnAddRowchildrendata") &&
  viewModel.get("btnAddRowchildrendata").on("click", function (data) {
    // 增行--单击
  });
viewModel.on("beforeAddRow", function (args) {
  return false;
});
viewModel.get("button27li") &&
  viewModel.get("button27li").on("click", function (data) {
    // 手动增行--单击
    var data = {
      billtype: "voucher",
      billno: "cff34347",
      params: {
        mode: "edit"
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });