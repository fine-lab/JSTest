viewModel.get("xzmj009List") &&
  viewModel.get("xzmj009List").getEditRowModel() &&
  viewModel.get("xzmj009List").getEditRowModel().get("Def2.name") &&
  viewModel
    .get("xzmj009List")
    .getEditRowModel()
    .get("Def2.name")
    .on("blur", function (data) {
      // 门禁编码--失去焦点的回调
    });
viewModel.get("button32lg") &&
  viewModel.get("button32lg").on("click", function (data) {
    // 门禁清单--单击
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal12sc", //模态框容器编码
        viewModel: viewModel
      }
    });
  });