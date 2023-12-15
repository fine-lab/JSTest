viewModel.on("customInit", function (data) {
  //销售订单参照--页面初始化
  setlayoutDisplay("TreeTableHeader", false); //表头工具栏隐藏
  gridModel.setState("actionStatesVisible", false); //表格按钮栏隐藏
  let aa = document.body.get("dropdownbuttonbtnAddGroup");
  console.log(aa);
});