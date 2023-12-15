viewModel.get("button24mg") &&
  viewModel.get("button24mg").on("click", function (data) {
    // 打印--单击
    viewModel.communication({
      type: "page",
      payload: {
        mode: "inner",
        groupCode: "page19ec",
        viewModel: viewModel,
        data: {}
      }
    });
  });