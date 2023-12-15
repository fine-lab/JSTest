viewModel.get("button13xf") &&
  viewModel.get("button13xf").on("click", function (data) {
    // 增行--单击
    var gridModel = viewModel.get("treeChild917List");
    gridModel.appendRow({});
  });
viewModel.get("button20zf") &&
  viewModel.get("button20zf").on("click", function (data) {
    // 删行--单击
    var gridModel = viewModel.get("treeChild917List");
    console.log(data.index);
    gridModel.deleteRows([data.index]);
  });
viewModel.on("modeChange", function (data) {
  console.log("123");
  if (data == "add") {
    //添加状态
    viewModel.get("button13xf").setVisible(true);
  } else {
    //浏览态 browse
    viewModel.get("button13xf").setVisible(false);
  }
});