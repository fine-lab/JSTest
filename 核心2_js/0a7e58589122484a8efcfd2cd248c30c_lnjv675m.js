viewModel.get("charge") &&
  viewModel.get("charge").on("afterValueChange", function (data) {
    // 是否计费--值改变后
    let value = data.value.value;
    if (value == "0") {
      viewModel.get("test_GxyService_testGxyServiceList").clear(); //清空配套服务内容
      viewModel.get("test_GxyService_testGxyServiceList").setReadOnly(true);
      viewModel.get("BasePrice").setValue(0); //基础费用
      viewModel.get("BasePrice").setReadOnly(true);
      viewModel.get("UserPrice").setValue(0); //用户数价格
      viewModel.get("UserPrice").setReadOnly(true);
      viewModel.get("OrgPrice").setValue(0); //组织账簿价格
      viewModel.get("OrgPrice").setReadOnly(true);
      viewModel.get("isBase").setValue("0"); //计价基础费用
      viewModel.get("isBase").setReadOnly(true);
      viewModel.get("isUser").setValue("0"); //按用户收费
      viewModel.get("isUser").setReadOnly(true);
      viewModel.get("isOrg").setValue("0"); //按组织账簿收费
      viewModel.get("isOrg").setReadOnly(true);
    } else if (value == "1") {
      viewModel.get("test_GxyService_testGxyServiceList").setReadOnly(false);
      viewModel.get("BasePrice").setReadOnly(false);
      viewModel.get("UserPrice").setReadOnly(false);
      viewModel.get("OrgPrice").setReadOnly(false);
      viewModel.get("isBase").setValue("1"); //计价基础费用
      viewModel.get("isBase").setReadOnly(false);
      viewModel.get("isUser").setValue("1"); //按用户收费
      viewModel.get("isUser").setReadOnly(false);
      viewModel.get("isOrg").setValue("1"); //按组织账簿收费
      viewModel.get("isOrg").setReadOnly(false);
    }
  });
viewModel.get("isBase") &&
  viewModel.get("isBase").on("afterValueChange", function (data) {
    // 计收基础费用--值改变后
    let value = data.value.value;
    if (value == "0") {
      viewModel.get("BasePrice").setValue(0);
      viewModel.get("BasePrice").setReadOnly(true);
    }
  });
viewModel.get("isUser") &&
  viewModel.get("isUser").on("afterValueChange", function (data) {
    // 按用户收费--值改变后
    let value = data.value.value;
    if (value == "0") {
      viewModel.get("UserPrice").setValue(0);
      viewModel.get("UserPrice").setReadOnly(true);
    }
  });
viewModel.get("isOrg") &&
  viewModel.get("isOrg").on("afterValueChange", function (data) {
    // 按组织账簿收费--值改变后
    let value = data.value.value;
    if (value == "0") {
      viewModel.get("OrgPrice").setValue(0);
      viewModel.get("OrgPrice").setReadOnly(true);
    }
  });