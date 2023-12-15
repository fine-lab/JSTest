viewModel.get("data_source_type") &&
  viewModel.get("data_source_type").on("afterSelect", function (data) {
    // 数据源类型--选择后
    if (data == undefined) {
      viewModel.get("db_type").setVisible(false);
      viewModel.get("db_port").setVisible(false);
      viewModel.get("db_user").setVisible(false);
      viewModel.get("db_password").setVisible(false);
      viewModel.get("appCode").setVisible(false);
      viewModel.get("DATA_SOURCE_NAME").setVisible(false);
      return;
    }
    var data_source_type = data.value;
    if (data_source_type == "语义模型") {
      viewModel.get("appCode").setVisible(true);
      viewModel.get("appCode").setState("bIsNull", false);
      viewModel.get("DATA_SOURCE_NAME").setVisible(true);
      viewModel.get("DATA_SOURCE_NAME").setState("bIsNull", false);
      viewModel.get("db_type").setVisible(false);
      viewModel.get("db_type").setState("bIsNull", true);
      viewModel.get("db_port").setVisible(false);
      viewModel.get("db_port").setState("bIsNull", true);
      viewModel.get("db_user").setVisible(false);
      viewModel.get("db_user").setState("bIsNull", true);
      viewModel.get("db_password").setVisible(false);
      viewModel.get("db_password").setState("bIsNull", true);
    }
    if (data_source_type == "关系型数据源") {
      viewModel.get("db_type").setVisible(true);
      viewModel.get("db_type").setState("bIsNull", false);
      viewModel.get("db_port").setVisible(true);
      viewModel.get("db_port").setState("bIsNull", false);
      viewModel.get("db_user").setVisible(true);
      viewModel.get("db_user").setState("bIsNull", false);
      viewModel.get("db_password").setVisible(true);
      viewModel.get("db_password").setState("bIsNull", false);
      viewModel.get("appCode").setVisible(false);
      viewModel.get("appCode").setState("bIsNull", true);
      viewModel.get("DATA_SOURCE_NAME").setVisible(false);
      viewModel.get("DATA_SOURCE_NAME").setState("bIsNull", true);
    }
  });
viewModel.on("afterLoadData", function (data) {
  //用于卡片页面，页面初始化赋值等操作
  const data_source_type = data.data_source_type;
  if (data_source_type == "语义模型") {
    viewModel.get("db_type").setVisible(false);
    viewModel.get("db_port").setVisible(false);
    viewModel.get("db_user").setVisible(false);
    viewModel.get("db_password").setVisible(false);
    viewModel.get("DATA_SOURCE_NAME").setState("bIsNull", false);
    viewModel.get("appCode").setState("bIsNull", false);
    viewModel.get("db_type").setState("bIsNull", true);
    viewModel.get("db_port").setState("bIsNull", true);
    viewModel.get("db_user").setState("bIsNull", true);
    viewModel.get("db_password").setState("bIsNull", true);
  } else if (data_source_type == "关系型数据源") {
    viewModel.get("appCode").setVisible(false);
    viewModel.get("DATA_SOURCE_NAME").setVisible(false);
    viewModel.get("DATA_SOURCE_NAME").setState("bIsNull", true);
    viewModel.get("appCode").setState("bIsNull", true);
    viewModel.get("db_type").setState("bIsNull", false);
    viewModel.get("db_port").setState("bIsNull", false);
    viewModel.get("db_user").setState("bIsNull", false);
    viewModel.get("db_password").setState("bIsNull", false);
  } else {
    viewModel.get("db_type").setVisible(false);
    viewModel.get("db_port").setVisible(false);
    viewModel.get("db_user").setVisible(false);
    viewModel.get("db_password").setVisible(false);
    viewModel.get("appCode").setVisible(false);
    viewModel.get("DATA_SOURCE_NAME").setVisible(false);
  }
});