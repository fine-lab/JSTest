viewModel.get("button22he") &&
  viewModel.get("button22he").on("click", function (data) {
    // 查看合同相关信息--单击
    debugger;
    var GridData = viewModel.getGridModel();
    var xmid = GridData.getRow(data.index).xm1_id;
    window.open("https://www.example.com/" + xmid);
  });