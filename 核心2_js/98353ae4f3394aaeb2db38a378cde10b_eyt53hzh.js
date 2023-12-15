viewModel.get("define1") &&
  viewModel.get("define1").on("beforeValueChange", function (data) {
    // 文本自定义项1--值改变前
  });
viewModel.get("btnSubmit") &&
  viewModel.get("btnSubmit").on("click", function (data) {
    // 提交--单击
    const value = viewModel.get("agentId_name1_name").getValue();
    viewModel.get("define1").setValue(value);
  });
viewModel.get("agentId_name1_name") &&
  viewModel.get("agentId_name1_name").on("afterValueChange", function (data) {
    // 客户名称--值改变后
    viewModel.get("define1").setValue(viewModel.get("agentId_name1_name").getValue());
  });
viewModel.get("RZH_12List") &&
  viewModel.get("RZH_12List").on("afterSetDataSource", function (data) {
    // 表格-发货装箱表体--设置数据源后
    // 客户名称--值改变后
    viewModel.get("define1").setValue(viewModel.get("agentId_name1_name").getValue());
  });