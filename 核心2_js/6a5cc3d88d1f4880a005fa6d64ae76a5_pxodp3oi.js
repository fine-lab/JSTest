viewModel.get("guojia_guoJiaMingCheng") &&
  viewModel.get("guojia_guoJiaMingCheng").on("afterReferOkClick", function (data) {
    // 国家--参照弹窗确认按钮点击后
    //建机事业部
    let org = viewModel.get("org_id_name").getValue(); //'环保事业部';
    let daqu_id = viewModel.get("item211dd").getValue(); //建机大区
    let daqu_name = viewModel.get("item149ak").getValue(); //建机大区
    let jibie_id = viewModel.get("item229ea").getValue(); //建机级别
    let jibie_name = viewModel.get("item161qc").getValue(); //建机级别
    let baZhang_id = viewModel.get("item856bh").getValue(); //建机大区巴长
    let baZhang_name = viewModel.get("item787yj").getValue();
    let baZhangZu = viewModel.get("item1204dk").getValue(); //建机巴长组
    let baZhangDeptId = viewModel.get("item1389di").getValue(); //建机巴长部门
    if (org.indexOf("环保") > -1) {
      daqu_id = viewModel.get("item338rh").getValue(); //环保大区
      daqu_name = viewModel.get("item274ob").getValue(); //大区
      jibie_id = viewModel.get("item368ni").getValue(); //环保级别
      jibie_name = viewModel.get("item298ec").getValue(); //级别
      baZhang_id = viewModel.get("item997oc").getValue(); //环保大区巴长
      baZhang_name = viewModel.get("item926fe").getValue();
      baZhangZu = viewModel.get("item1265gh").getValue(); //环保巴长组
      baZhangDeptId = viewModel.get("item1449cj").getValue(); //环保巴长部门
    } else if (org.indexOf("游乐") > -1) {
      daqu_id = viewModel.get("item469ng").getValue(); //游乐大区
      daqu_name = viewModel.get("item403xg").getValue(); //大区
      jibie_id = viewModel.get("item511qa").getValue(); //环保级别
      jibie_name = viewModel.get("item439pc").getValue(); //级别
      baZhang_id = viewModel.get("item1142zf").getValue(); //游乐大区巴长
      baZhang_name = viewModel.get("item1069lk").getValue();
      baZhangZu = viewModel.get("item1327kg").getValue(); //游乐巴长组
      baZhangDeptId = viewModel.get("item1510ae").getValue(); //游乐巴长部门
    }
    viewModel.get("daqu").setValue(daqu_id); //id
    viewModel.get("daqu_mingCheng").setValue(daqu_name); //名称
    viewModel.get("jibie_mingCheng").setValue(jibie_name); //id
    viewModel.get("jibie").setValue(jibie_id); //名称
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