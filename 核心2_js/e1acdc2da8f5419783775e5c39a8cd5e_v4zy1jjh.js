viewModel.get("button27aj") &&
  viewModel.get("button27aj").on("click", function (data) {
    var viewModel = this;
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "b206b541List", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        shoujixinghao: "111111111"
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });