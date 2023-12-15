viewModel.on("customInit", function (data) {
  // 销售主表模态框--页面初始化
  debugger;
  // 接收参数
  var id = viewModel.getParams().productID;
  var name = viewModel.getParams().productNAME;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("mujianbianma").getFromModel().setValue(id);
      filtervm.get("mujianmingchen").getFromModel().setValue(name);
    });
  });
});
viewModel.get("button6bi") &&
  viewModel.get("button6bi").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });