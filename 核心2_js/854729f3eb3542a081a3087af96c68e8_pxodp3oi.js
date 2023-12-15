viewModel.get("guoJiaDangAn_guoJiaMingCheng") &&
  viewModel.get("guoJiaDangAn_guoJiaMingCheng").on("afterReferOkClick", function (data) {
    // 国家--参照弹窗确认按钮点击后
    //建机事业部
    let org = viewModel.get("org_id_name").getValue(); //'环保事业部';
    let daqu = viewModel.get("item276yi").getValue(); //建机大区id
    let daqu_mingCheng = viewModel.get("item208xd").getValue(); //大区名称
    if (org.indexOf("环保") > -1) {
      daqu = viewModel.get("item415ha").getValue(); //环保大区id
      daqu_mingCheng = viewModel.get("item345li").getValue(); //大区
    } else if (org.indexOf("游乐") > -1) {
      daqu = viewModel.get("item558sh").getValue(); //游乐大区id
      daqu_mingCheng = viewModel.get("item486nb").getValue(); //大区
    }
    viewModel.get("daqu").setValue(daqu); //id
    viewModel.get("daqu_mingCheng").setValue(daqu_mingCheng); //名称
  });