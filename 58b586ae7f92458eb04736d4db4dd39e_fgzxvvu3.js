viewModel.get("button32nj") &&
  viewModel.get("button32nj").on("click", function (data) {
    // 按钮--单击
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal12og",
        viewModel: viewModel,
        data: {}
      }
    });
  });
viewModel.get("button39me") &&
  viewModel.get("button39me").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("5a03bff426fd4ef6a3ccad6c884d8b34", {}, function (err, res) {
      debugger;
    });
  });