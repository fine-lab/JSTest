viewModel.get("button50ug") &&
  viewModel.get("button50ug").on("click", function (data) {
    // 按钮--单击
    var line = data.index;
    viewModel.getGridModel().select(line);
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "74afa5f8", // 单据号
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        //传参
        shoujixinghao: "111111111"
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });