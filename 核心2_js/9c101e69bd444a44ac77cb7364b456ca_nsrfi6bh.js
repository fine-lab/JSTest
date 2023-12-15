viewModel.get("button18tf") &&
  viewModel.get("button18tf").on("click", function (data) {
    // 弹出模态框--单击
    var viewModel = this;
    //获取选中行的行号
    var line = event.params.index;
    //获取选中行数据信息
    var shoujixinghao = viewModel.getGridModel().getRow(line).id;
    //传递给被打开页面的数据信息
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "33b4c2f3", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        shoujixinghao: shoujixinghao
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });