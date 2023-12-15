viewModel.get("guojia_guoJiaMingCheng") &&
  viewModel.get("guojia_guoJiaMingCheng").on("afterReferOkClick", function (data) {
    // 国家--参照弹窗确认按钮点击后
    //建机事业部
    let org = viewModel.get("org_id_name").getValue();
    let shichang_id = viewModel.get("item42sd").getValue();
    let shichang_mingCheng = viewModel.get("item40bd").getValue();
    if (org.indexOf("环保") > -1) {
      shichang_id = viewModel.get("item46ij").getValue(); //级别
      shichang_mingCheng = viewModel.get("item44lk").getValue(); //级别
    } else if (org.indexOf("游乐") > -1) {
      shichang_id = viewModel.get("item46ij").getValue(); //级别
      shichang_mingCheng = viewModel.get("item48ad").getValue(); //级别
    }
    viewModel.get("shichang_mingCheng").setValue(shichang_name);
    viewModel.get("shichang").setValue(shichang_id);
    let op = "eq";
    let value1 = 0;
    if (orgName.indexOf("建机") > -1) {
      value1 = 1;
    } else if (orgName.indexOf("环保") > -1) {
      value1 = 2;
    } else if (orgName.indexOf("游乐") > -1) {
      value1 = 3;
    } else {
      value1 = 0;
    }
  });