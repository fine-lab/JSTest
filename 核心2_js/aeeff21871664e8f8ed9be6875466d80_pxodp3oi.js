viewModel.get("guoJiaDangAn_guoJiaMingCheng") &&
  viewModel.get("guoJiaDangAn_guoJiaMingCheng").on("afterReferOkClick", function (data) {
    // 国家--参照弹窗确认按钮点击后
    //建机事业部
    let org = viewModel.get("org_id_name").getValue(); //'环保事业部';
    let daqu1 = viewModel.get("item89yi").getValue(); //建机大区id
    let daqu1_mingCheng = viewModel.get("item78ib").getValue(); //大区名称
    if (org.indexOf("环保") > -1) {
      daqu1 = viewModel.get("item110bg").getValue(); //环保大区id
      daqu1_mingCheng = viewModel.get("item99df").getValue(); //大区
    } else if (org.indexOf("游乐") > -1) {
      daqu1 = viewModel.get("item135vf").getValue(); //游乐大区id
      daqu1_mingCheng = viewModel.get("item122qb").getValue(); //大区
    }
    viewModel.get("daqu1").setValue(daqu1); //id
    viewModel.get("daqu1_mingCheng").setValue(daqu1_mingCheng); //名称
  });