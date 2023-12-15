viewModel.get("button22ji") &&
  viewModel.get("button22ji").on("click", function (data) {
    // 项目相关信息--单击
    debugger;
    var GridData = viewModel.getGridModel();
    var xmid = GridData.getRow(data.index).id;
    window.open("https://www.example.com/" + xmid);
  });