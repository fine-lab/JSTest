viewModel.on("customInit", function (data) {
  // 单表模态弹框--页面初始化
  debugger;
  var bh = viewModel.getParams().new1;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("new1").getFromModel().setValue(bh);
    });
  });
});
viewModel.get("button3ak") &&
  viewModel.get("button3ak").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button8ba") &&
  viewModel.get("button8ba").on("click", function (data) {
    // 确定--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });