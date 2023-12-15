viewModel.get("button13xc") &&
  viewModel.get("button13xc").on("click", function (data) {
    // 增行--单击
    var gridModel = viewModel.get("treech_nishchList"); //获取实体模型
    gridModel.appendRow({});
  });
viewModel.get("button20la") &&
  viewModel.get("button20la").on("click", function (data) {
    // 删行--单击
    var rows = viewModel.getGridModel().getRows();
    var gridModel = viewModel.get("treech_nishchList"); //获取实体模型
    gridModel.deleteRows([rows]);
  });
viewModel.on("modeChange", function (data) {
  // 左树右卡_nishch--页面初始化
  if (data == "browse") {
    viewModel.get("button13xc").setVisible(false);
    viewModel.get("button20la").setVisible(false);
  } else {
    viewModel.get("button13xc").setVisible(true);
    viewModel.get("button20la").setVisible(true);
  }
});