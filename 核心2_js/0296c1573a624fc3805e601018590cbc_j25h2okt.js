viewModel.get("button24xg") &&
  viewModel.get("button24xg").on("click", function (data) {
    // 推WMS--单击
    //获取选中行的行号
    var line = data.params.index;
    //获取选中行数据信息
    var shoujixinghao = viewModel.getGridModel().getRow(line).id;
  });