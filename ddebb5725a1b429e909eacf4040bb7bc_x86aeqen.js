viewModel.on("customInit", function (data) {
  //验证审批历史组件单卡--页面初始化
});
viewModel.get("button22fc") &&
  viewModel.get("button22fc").on("click", function (data) {
    //打开模态框--单击
    debugger;
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "page11jc",
        groupCode: "modal10fa",
        viewModel: viewModel,
        data: {}
      }
    });
  });