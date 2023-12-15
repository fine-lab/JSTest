viewModel.on("customInit", function (data) {
  var bh = viewModel.getParams().shoujixinghao;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("bu").getFromModel().setValue(bh);
    });
  });
});
viewModel.get("button7nf") &&
  viewModel.get("button7nf").on("click", function (e) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button4gg") &&
  viewModel.get("button4gg").on("click", function (data) {
    // 确定--单击
    //获取选中行数据信息
    var d = viewModel.getGridModel().getSelectedRows()[0].bu;
    var filtervm = viewModel.getCache("parentViewModel").getCache("FilterViewModel");
    filtervm.get("cus").getFromModel().setValue(d);
    //给父表格赋值
  });