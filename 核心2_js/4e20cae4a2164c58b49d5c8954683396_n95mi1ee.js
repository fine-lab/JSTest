viewModel.get("button27pf") &&
  viewModel.get("button27pf").on("click", function (data) {
    //测试--单击
    var gm = viewModel.getGridModel("testSon_zyy08List");
    console.log(gm);
    //获取表格模型并输出
    console.log(gm.getData());
    //获取全部数据
  });
viewModel.get("testSon_zyy08List") &&
  viewModel.get("testSon_zyy08List").on("beforeSelect", function (data) {
    //表格-测试子实体_zyy08(函数-表格模型)--选择前
    alert(viewModel.get("testSon_zyy08List").getCellValue(data, new1));
  });