viewModel.get("button27bg") &&
  viewModel.get("button27bg").on("click", function (data) {
    //测试--单击
    var gm = viewModel.getGridModel("testSon_zyy08List");
    console.log(gm);
    //获取表格模型,并输出
    console.log(gm.getData());
    //获取当前所有数据
  });