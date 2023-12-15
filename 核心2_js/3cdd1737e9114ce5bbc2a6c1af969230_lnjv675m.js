viewModel.get("num") &&
  viewModel.get("num").on("blur", function (data) {
    //天眼查组织id--失去焦点的回调
    var currentState = viewModel.getParams();
    // 保存--单击
    var id = viewModel.get("id").getValue();
    var num = viewModel.get("num").getValue();
    if (currentState.mode == "add") {
      let sql = "select name,num from AT184A9A0C0948000A.AT184A9A0C0948000A.OrgInfo where num='" + num + "' and dr=0";
      cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
        var list = res.recordList;
        if (list.length > 0) {
          viewModel.get("num").setValue("");
        }
      });
    }
  });
viewModel.get("baseOrg_name") &&
  viewModel.get("baseOrg_name").on("beforeBrowse", function (data) {
    //组织单元(系统)--参照弹窗打开前
    let sql =
      "select oif.baseOrg,oif.name,oif.num,go.sysOrg " +
      "from GT34544AT7.GT34544AT7.GxsOrg go " +
      "left join AT184A9A0C0948000A.AT184A9A0C0948000A.OrgInfo oif on go.sysOrg=oif.baseOrg " +
      "where oif.baseOrg is null ";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      console.log(res.recordList);
    });
  });