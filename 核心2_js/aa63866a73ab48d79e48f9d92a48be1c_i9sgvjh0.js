viewModel.on("customInit", function (data) {
  // 模态框主表--页面初始化
  debugger;
  // 接收参数
  var id = viewModel.getParams().productID;
  var name = viewModel.getParams().productNAME;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("parentPartCode").getFromModel().setValue(id);
      filtervm.get("parentPartName").getFromModel().setValue(name);
    });
  });
});
viewModel.get("button2wg") &&
  viewModel.get("button2wg").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });