viewModel.get("button20wd") &&
  viewModel.get("button20wd").on("click", function (data) {
    // 弹窗--单击
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal7rd", // 模态框组件的编码
        viewModel: viewModel
      }
    });
  });