viewModel.on("customInit", function (data) {
  // 客户费用单据--页面初始化
  debugger;
  var viewModel = this;
  // 将父页面传过来的参数弹出
  cb.utils.alert(viewModel.getParams().hello);
  // 取消按钮
  viewModel.get("button2xj").on("click", function (data) {
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
  // 确认按钮
  viewModel.get("button6kj").on("click", function (args) {
    // 获取父页面模型
    let parentViewModel = viewModel.getCache("parentViewModel");
    // 获取弹出页面选中的下标
    var indexes = viewModel.getGridModel().getSelectedRowIndexes();
    // 获取弹出页面选中的数据
    indexes.forEach(function (index) {
      // 对父页面赋值
    });
    // 将表格内的所有行值设置到父页面的 cache 里，可以在父页面调用
    parentViewModel.setCache("childGridRows", viewModel.getGridModel().getRows());
    // 关闭弹窗
    viewModel.communication({
      type: "modal",
      payload: {
        data: false
      }
    });
  });
});