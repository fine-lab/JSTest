viewModel.get("button128aj") &&
  viewModel.get("button128aj").on("click", function (data) {
    // 测试--单击
    debugger;
    var gm = viewModel.getGridModel("msrqr_famxList");
    console.log(gm);
    console.log(gm.getData());
    console.log(gm.hasColumn("quanyikahao"));
  });