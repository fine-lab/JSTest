viewModel.get("button33hd") &&
  viewModel.get("button33hd").on("click", function (data) {
    // 按钮--单击
    // 阅读记录--单击
    var viewModel = this;
    //获取选中行的行号
    var line = event.params.index;
    //获取选中行数据信息
    var abnormalevent = viewModel.getGridModel().getRow(line).id;
    //传递给被打开页面的数据信息
    let data = {
      billtype: "VoucherList", // 单据类型
      billno: "d7c76475", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        abnormalevent: abnormalevent
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data, viewModel);
  });