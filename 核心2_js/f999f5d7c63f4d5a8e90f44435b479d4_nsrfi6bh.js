viewModel.on("customInit", function (data) {
  // 列表模态框测试--页面初始化
  var viewModel = this;
  debugger;
  var bh = viewModel.getParams().shoujixinghao;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("shoujixinghao").getFromModel().setValue(bh);
    });
  });
});
viewModel.get("button2qj") &&
  viewModel.get("button2qj").on("click", function (data) {
    // 取消--单击
    var viewModel = this;
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button6uc") &&
  viewModel.get("button6uc").on("click", function (data) {
    // 确认--单击
    var viewModel = this;
    viewModel.communication({ type: "modal", payload: { data: true } });
  });