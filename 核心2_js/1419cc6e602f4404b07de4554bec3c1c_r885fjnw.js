var gridModel = viewModel.getGridModel();
var footerCode = "toolbar12rk";
//初始化设置底部栏隐藏
viewModel.on("afterMount", function () {
  setlayoutDisplay(footerCode, false);
});
viewModel.get("button8ph") &&
  viewModel.get("button8ph").on("click", function (data) {
    //编辑--单击
    setlayoutDisplay("TreeTableHeader", false); //表头工具栏隐藏
    setlayoutDisplay(footerCode, true); //底部栏显示
    gridModel.setState("actionStatesVisible", false); //表格按钮栏隐藏
    gridModel.setReadOnly(false); //设计表格允许编辑
  });