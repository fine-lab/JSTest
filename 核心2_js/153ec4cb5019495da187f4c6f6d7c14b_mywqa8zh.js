viewModel.get("button11yh") &&
  viewModel.get("button11yh").on("click", function (data) {
    var parentViewModel = viewModel.getCache("parentViewModel"); //获取到父model
  });
viewModel.get("button21yh") && viewModel.get("button21yh").on("click", function (data) {});
viewModel.get("button25fj") &&
  viewModel.get("button25fj").on("click", function (data) {
    // 模态框弹出--单击
    // 获取选中行的行号
    var line = event.params.index;
    //获取选中行数据信息
    //传递给被打开页面的数据信息
    let data1 = {
      //传参
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", data1, viewModel);
  });