viewModel.on("customInit", function (data) {
  // 主子页面--页面初始化
});
viewModel.get("button24qc").on("click", function () {
  let data = {
    billtype: "VoucherList", // 单据类型
    billno: "0b107084", // 单据号
    params: {
      mode: "browse", // (编辑态edit、新增态add、浏览态browse)
      //传参
      a: 1
    }
  };
  //打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", data, viewModel);
});
viewModel.get("button24qc") &&
  viewModel.get("button24qc").on("click", function (data) {
    // 拉取--单击
  });