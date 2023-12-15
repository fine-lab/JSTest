viewModel.on("customInit", function (data) {
  // 客户代账组织维护详情--页面初始化
  cb.rest.invokeFunction("GT34544AT7.authManager.getAppContext", {}, function (err, res) {
    console.log(res);
  });
  function searchAgUserInfo(useruuid) {
    let returnPromise = new cb.promise();
    let table = "GT1559AT25.GT1559AT25.AgentUser";
    let conditions = {
      SysyhtUserId: useruuid
    };
    cb.rest.invokeFunction("GT34544AT7.common.selectSqlByMapX", { table, conditions }, function (err, res) {
      if (err) {
        returnPromise.reject(err);
      } else {
        let data = res.res;
        returnPromise.resolve(data);
      }
    });
    return returnPromise;
  }
  function searchAgStaffInfo(agstaff) {
    let returnPromise = new cb.promise();
    let table = "	GT1559AT25.GT1559AT25.AgentStaff";
    let conditions = {
      id: agstaff
    };
    cb.rest.invokeFunction("GT34544AT7.common.selectSqlByMapX", { table, conditions }, function (err, res) {
      if (err) {
        returnPromise.reject(err);
      } else {
        let data = res.res;
        returnPromise.resolve(data);
      }
    });
    return returnPromise;
  }
});
viewModel.get("OrgCode") &&
  viewModel.get("OrgCode").on("afterValueChange", function (data) {
    // 组织编码--值改变后
    console.log(data);
  });
viewModel.get("position") &&
  viewModel.get("position").on("afterValueChange", function (event) {
    // 地理位置--值改变后
    console.log(JSON.stringify(event));
    let js = event.value;
    let jsp = JSON.parse(js);
    setTimeout(function () {
      if (jsp.longitude !== undefined) viewModel.get("longitude").setValue(jsp.longitude);
      if (jsp.latitude !== undefined) viewModel.get("latitude").setValue(jsp.latitude);
    }, 1000);
  });
viewModel.get("position") &&
  viewModel.get("position").on("afterValueChange", function (data) {
    // 地理位置--值改变后
  });
viewModel.get("button13qb") &&
  viewModel.get("button13qb").on("click", function (data) {
    //按钮--单击
    // 保存--单击
    var id = viewModel.get("id").getValue();
    var name = viewModel.get("name").getValue();
    var sql = "";
    if (!!id) {
      sql += "select id from GT1559AT25.GT1559AT25.AgentOrg where name='" + name + "' and id!='" + id + "' and dr=0 ";
    } else {
      sql += "select id from GT1559AT25.GT1559AT25.AgentOrg where name='" + name + "' and dr=0 ";
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      var list = res.recordList;
      if (list.length > 0) {
        cb.utils.confirm(
          "保存失败=>名称重复或为空，请重新输入",
          function () {},
          function (args) {}
        );
      } else {
        var btn = viewModel.get("btnSave");
        btn.execute("click");
      }
    });
  });
viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    //客户名称--值改变后
    var id = viewModel.get("id").getValue();
    var name = viewModel.get("name").getValue();
    var sql = "";
    if (!!id) {
      sql += "select id from GT1559AT25.GT1559AT25.AgentOrg where name='" + name + "' and id!='" + id + "' and dr=0 ";
    } else {
      sql += "select id from GT1559AT25.GT1559AT25.AgentOrg where name='" + name + "' and dr=0 ";
    }
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      var list = res.recordList;
      if (list.length > 0) {
        viewModel.get("item763fj").setValue("名称重复!");
      } else {
        viewModel.get("item763fj").setValue("名称正确!");
      }
    });
  });