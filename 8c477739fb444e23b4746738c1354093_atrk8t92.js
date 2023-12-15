viewModel.get("zjtype") &&
  viewModel.get("zjtype").on("afterValueChange", function (data) {
    // 类型--值改变后
    debugger;
    if (data.value.value === "1") {
      viewModel.get("zjname_name").setVisible(true);
      viewModel.get("zjEmployer_name").setVisible(true);
      viewModel.get("wbzjname").setVisible(false);
      viewModel.get("wbzjEmployer").setVisible(false);
      viewModel.get("zjname_name").setState("bIsNull", false);
      viewModel.get("wbzjname").setState("bIsNull", true);
    } else {
      viewModel.get("zjname_name").setVisible(false);
      viewModel.get("zjEmployer_name").setVisible(false);
      viewModel.get("wbzjname").setVisible(true);
      viewModel.get("wbzjEmployer").setVisible(true);
      viewModel.get("zjname_name").setState("bIsNull", true);
      viewModel.get("wbzjname").setState("bIsNull", false);
    }
  });
viewModel.on("customInit", function (data) {
  // 专家库信息维护详情--页面初始化
  viewModel.on("afterMount", function (data) {
    let zjtype = viewModel.get("zjtype").getData();
    if (zjtype === "1") {
      viewModel.get("zjname_name").setVisible(true);
      viewModel.get("zjEmployer_name").setVisible(true);
      viewModel.get("wbzjname").setVisible(false);
      viewModel.get("wbzjEmployer").setVisible(false);
      viewModel.get("zjname_name").setState("bIsNull", false);
      viewModel.get("wbzjname").setState("bIsNull", true);
    } else {
      viewModel.get("zjname_name").setVisible(false);
      viewModel.get("zjEmployer_name").setVisible(false);
      viewModel.get("wbzjname").setVisible(true);
      viewModel.get("wbzjEmployer").setVisible(true);
      viewModel.get("zjname_name").setState("bIsNull", true);
      viewModel.get("wbzjname").setState("bIsNull", false);
    }
  });
});