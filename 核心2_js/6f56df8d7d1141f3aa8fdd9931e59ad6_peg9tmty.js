viewModel.on("customInit", function (data) {
  // 产品信息模态框--页面初始化
  debugger;
  var code = viewModel.getParams().clientCode;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("Entrusting_enterprise_code").getFromModel().setValue(code);
    });
  });
});