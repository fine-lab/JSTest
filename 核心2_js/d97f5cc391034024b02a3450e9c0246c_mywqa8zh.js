viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  // 获取 销售订单详情点击现存量查询按钮传过来的productId
  let productId = viewModel.getParams().productId;
  // 获取 销售订单详情点击现存量查询按钮传过来的 商品数量
  let qty = viewModel.getParams().qty;
  commonVOs.push({
    itemName: "currentqty",
    op: "gt",
    value1: qty
  });
});
// 取消--单击
viewModel.get("button2ah") &&
  viewModel.get("button2ah").on("click", function (data) {
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
// 确定--单击
viewModel.get("button6zg") &&
  viewModel.get("button6zg").on("click", function (data) {
    // 获取到父model的表格模型
    var parentViewModel = viewModel.getCache("parentViewModel").getGridModel();
    // 获取到父模型传过来的当前行的下标
    var rowIndex = viewModel.getParams().currentLine;
    // 获取到自身的表格中选中的数据
    let rowsData = viewModel.getGridModel().getSelectedRows();
    if (rowsData.length != 1) {
      cb.utils.alert("请选择一条数据！", "error");
      return false;
    }
    // 给父模型的当前行的数据的某个字段赋值
    parentViewModel.setCellValue(rowIndex, "item190xj", rowsData[0].currentqty);
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.on("customInit", function (data) {
  // 现存量查询lxl--页面初始化
  var gridModel = viewModel.getGridModel();
  //设置表格取消复选
  gridModel.setState("showCheckBox", false);
});