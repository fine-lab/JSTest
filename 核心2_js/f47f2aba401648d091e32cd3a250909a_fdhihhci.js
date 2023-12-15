viewModel.get("button3sa") &&
  viewModel.get("button3sa").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button8hh") &&
  viewModel.get("button8hh").on("click", function (data) {
    // 确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel");
    var data = viewModel.get("new1").getValue();
    parentViewModel.get("childrendataList").appendRow({ new1: data });
    viewModel.communication({ type: "modal", payload: { data: false } });
  });