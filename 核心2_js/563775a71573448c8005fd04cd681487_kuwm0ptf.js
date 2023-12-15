viewModel.get("button31fg") &&
  viewModel.get("button31fg").on("click", function (data) {
    // 现存量查询--单击
    //获取选中行的行号
    var line = data.index;
    //获取选中行数据信息
    var shoujixinghao = viewModel.getGridModel().getRow(line).productId;
    //传递给被打开页面的数据信息
    let data1 = {
      billtype: "VoucherList", // 单据类型
      billno: "d22b4f1e", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        shoujixinghao: shoujixinghao
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });