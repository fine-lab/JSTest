viewModel.get("button24tf") &&
  viewModel.get("button24tf").on("click", function (data) {
    // 测试按钮--单击
    var socket = new WebSocket("wss://localhost:13529");
    cb.utils.alert("");
  });