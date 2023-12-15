viewModel.get("test_OrderServiceUseOrg_UseOrg_name") &&
  viewModel.get("test_OrderServiceUseOrg_UseOrg_name").on("afterValueChange", function (data) {
    // 用户组织--值改变后
  });
viewModel.get("gxyUserOrg_UserName") &&
  viewModel.get("gxyUserOrg_UserName").on("afterValueChange", function (data) {
    // 用户--值改变后
    var userorg = viewModel.get("item237tb").getValue();
    var userType = viewModel.get("userType").getValue();
    var userorgid = viewModel.get("gxyUserOrg").getValue();
    var SysyhtUserId = viewModel.get("SysyhtUserId").getValue();
    var sql = "";
    switch (userType) {
      case "1":
        // 行业用户
        sql += "select id from GT1559AT25.GT1559AT25.GxyUserStaffJobNew where SysOrg='" + userorg + "' and SysyhtUserId='" + SysyhtUserId + "' and GxyUserStaffJobNewFk='" + userorgid + "'";
        break;
    }
    if (sql !== "") {
      console.log("sql = " + sql);
      cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
        console.log("res => " + JSON.stringify(res));
        var { recordList } = res;
        if (recordList.length == 1) {
          var id = recordList[0].id;
          viewModel.get("gxyUserID").setValue(id);
        } else {
          console.log("recordList => " + JSON.stringify(recordList));
        }
        console.log("err => " + err);
      });
    }
    console.log("userorgid = " + userorg);
    console.log("userType = " + userType);
  });
viewModel.get("test_GxyRole_name") &&
  viewModel.get("test_GxyRole_name").on("beforeBrowse", function (data) {
    // 授权角色--参照弹窗打开前
    let promise = new cb.promise();
    let test_GxyService = viewModel.get("test_GxyService").getValue();
    cb.rest.invokeFunction("GT3AT33.role.canUseRole", { test_GxyService: test_GxyService }, function (err, res) {
      if (err != null) {
        cb.utils.alert("查询免费服务时报错" + JSON.stringify(err), "error");
      }
      let roleArr = res.roleArr;
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "id",
        op: "in",
        value1: roleArr
      });
      console.log("roleArr = " + roleArr);
      viewModel.get("test_GxyRole_name").setFilter(myFilter);
      promise.resolve();
    });
    return promise;
  });