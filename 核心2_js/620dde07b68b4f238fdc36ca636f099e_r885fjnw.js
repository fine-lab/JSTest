viewModel.get("button13db") &&
  viewModel.get("button13db").on("click", function (data) {
    //增行--单击
    var gridModel = viewModel.get("treech_testList"); //获取表格模型
    gridModel.appendRow({});
  });
viewModel.get("button20wd") &&
  viewModel.get("button20wd").on("click", function (data) {
    //删行--单击
    var gridModel = viewModel.get("treech_testList"); //获取表格模型
    gridModel.deleteRows([data.index]);
  });