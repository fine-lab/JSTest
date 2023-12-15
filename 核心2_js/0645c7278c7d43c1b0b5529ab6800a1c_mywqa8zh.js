viewModel.on("customInit", function (data) {
  // 左树右表测试--页面初始化
  debugger;
  // 浏览态的数组【新增，编辑，删除】
  var browse = ["btnAdd", "button14fh", "btnBatchDelete"];
  // 新增态的数组【增行，删行】
  var addOrEdit = ["button19ee", "button24bc"];
  var gridModel = viewModel.getGridModel();
  // 设置初始状态按钮 【页面加载完成之后事件】
  viewModel.on("afterMount", function () {
    setIsDisplay("footer8ze", false);
    buttonIsDisplay(browse, true);
    buttonIsDisplay(addOrEdit, false);
  });
  // 编辑按钮点击事件
  viewModel.get("button14fh").on("click", function (params) {
    setIsDisplay("footer8ze", true);
    buttonIsDisplay(browse, false);
    buttonIsDisplay(addOrEdit, true);
    // 设置表格可编辑
    gridModel.setReadOnly(false);
  });
  // 取消按钮单击事件
  viewModel.get("button9ak").on("click", function (params) {
    setIsDisplay("footer8ze", false);
    buttonIsDisplay(browse, true);
    buttonIsDisplay(addOrEdit, false);
    // 设置表格不可编辑【只读】
    gridModel.setReadOnly(true);
    // 刷新页面
    viewModel.execute("refresh");
  });
  // 增行操作【获取增行按钮的编码】
  viewModel.get("button19ee").on("click", function (params) {
    // 单表直接获取GridModel
    viewModel.getGridModel().appendRow({});
  });
  // 删行操作【获取删行按钮的编码】
  viewModel.get("button24bc").on("click", function (params) {
    // 获取当前表格的选中状态
    // 单表直接获取GridModel
    viewModel.getGridModel().deleteRows(viewModel.getGridModel().getSelectedRowIndexes());
  });
  function setIsDisplay(cGroupCode, isShow) {
    viewModel.execute("updateViewMeta", { code: cGroupCode, visible: isShow });
  }
  function buttonIsDisplay(butArr, isShow) {
    for (var btn in butArr) {
      viewModel.get(butArr[btn]).setVisible(isShow);
    }
  }
});
viewModel.get("button9ak") &&
  viewModel.get("button9ak").on("click", function (data) {
    // 取消--单击
  });
viewModel.get("button13yj") &&
  viewModel.get("button13yj").on("click", function (data) {
    // 保存--单击
  });