viewModel.get("en_testchilderList") &&
  viewModel.get("en_testchilderList").getEditRowModel() &&
  viewModel.get("en_testchilderList").getEditRowModel().get("new3") &&
  viewModel
    .get("en_testchilderList")
    .getEditRowModel()
    .get("new3")
    .on("blur", function (data) {
      // 字段3--失去焦点的回调
    });
viewModel.get("en_testchilderList").on("cellClick", function (arg) {
  debugger;
  console.log(arg);
});
viewModel.on("customInit", function (data) {
  // 测试子实体详情--页面初始化
});
viewModel.get("button27li") &&
  viewModel.get("button27li").on("click", function (data) {
    // 按钮--单击
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: "modal13hg",
        viewModel: viewModel,
        data: {}
      }
    });
  });