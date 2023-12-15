viewModel.get("guojia_guoJiaMingCheng") &&
  viewModel.get("guojia_guoJiaMingCheng").on("afterReferOkClick", function (data) {
    // 国家--参照弹窗确认按钮点击后
    //建机事业部
    let org = viewModel.get("org_id_name").getValue(); //'环保事业部';
    let daqu_id = viewModel.get("item211dd").getValue(); //大区
    let daqu_name = viewModel.get("item149ak").getValue(); //大区
    if (org.indexOf("环保") > -1) {
      daqu_id = viewModel.get("item338rh").getValue(); //大区
      daqu_name = viewModel.get("item274ob").getValue(); //大区
    } else if (org.indexOf("游乐") > -1) {
      daqu_id = viewModel.get("item469ng").getValue(); //大区
      daqu_name = viewModel.get("item403xg").getValue(); //大区
    }
    viewModel.get("daqu").setValue(daqu_id); //id
    viewModel.get("daqu_mingCheng").setValue(daqu_name); //名称
    let orgName = viewModel.get("org_id_name").getValue();
    if (orgName.indexOf("建机事业部") > -1) {
      let jjxm = viewModel.get("xiangMu").getValue();
      let countryId = viewModel.get("guojia").getValue();
      setJJManager(jjxm, countryId, baZhang_id, baZhang_name, baZhangZu);
    } else {
      viewModel.get("baZhang").setValue(baZhang_id); //id
      viewModel.get("baZhang_name").setValue(baZhang_name); //名称
      viewModel.get("baZhangZu").setValue(baZhangZu); //巴长组
      viewModel.get("baZhangOrgId").setValue(baZhangDeptId); //巴长部门
    }
  });