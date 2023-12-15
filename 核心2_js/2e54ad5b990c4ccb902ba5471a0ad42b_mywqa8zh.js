viewModel.on("customInit", function (data) {
  // 销售订单原材料详情--页面初始化
  debugger;
  var bh = viewModel.getParams().mujianbianma;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("mujianbianma").getFromModel().setValue(bh);
    });
  });
});
viewModel.get("button6ma") &&
  viewModel.get("button6ma").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });