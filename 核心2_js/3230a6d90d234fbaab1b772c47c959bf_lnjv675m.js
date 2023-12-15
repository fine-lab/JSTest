viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  // 处理自动用户角色绑定--页面初始化
  gridModel.on("afterSetDataSource", (data) => {
    const rows = gridModel.getRows();
    console.log(rows);
    if (rows.length > 0) {
      let index = 0;
      for (let rowindex in rows) {
        let row = rows[rowindex];
        setTimeout(function () {
          let roleCode = row.RoleCode;
          let userId = row.SysyhtUserId;
          console.log(roleCode);
          console.log(userId);
          console.log(row);
          let myid = row.id;
          console.log("myid = " + myid);
          if (row.BindFlag == "2") {
            unbinduserrole(row.id, roleCode, userId);
          }
        }, index * 100);
        index++;
      }
    }
  });
  function refresh() {
    viewModel.execute("refresh");
  }
  var gridModel = viewModel.getGridModel();
  let mytime = setInterval(() => {
    console.log("开始刷新");
    refresh();
    console.log("刷新完成");
  }, 10000);
  function binduserrole(id, roleCode, userId) {
    let returnPromise = new cb.promise();
    let req = { roleCode, userId };
    cb.rest.invokeFunction("GT34544AT7.roles.bindRole", req, function (err, res) {
      if (res) {
        console.log(res);
        let success = res.res.data;
        console.log(success);
        chageSql(id, success.id).then((res, err) => {
          if (res) {
            returnPromise.resolve(res);
          } else {
            returnPromise.reject(err);
          }
        });
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  function unbinduserrole(id, roleCode, userId) {
    let returnPromise = new cb.promise();
    let req = { roleCode, userId };
    cb.rest.invokeFunction("GT34544AT7.roles.unBindRole", req, function (err, res) {
      if (res) {
        console.log(res);
        let success = res.res.data;
        console.log(success);
        chageSqlUnBind(id, success.id).then((res, err) => {
          if (res) {
            returnPromise.resolve(res);
          } else {
            returnPromise.reject(err);
          }
        });
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  function chageSql(id, SysUserRole) {
    let returnPromise = new cb.promise();
    let table = "GT3AT33.GT3AT33.test_HistoryUserRole";
    let billNum = "yb283c61f3";
    let object = {
      id,
      SysUserRole,
      BindFlag: "1"
    };
    let req = { table, object, billNum };
    cb.rest.invokeFunction("GT34544AT7.common.updatesql", req, function (err, res) {
      if (res) {
        let dataorg = res.res;
        changechild(dataorg.id, SysUserRole).then((res, err) => {
          if (res) {
            returnPromise.resolve(res);
          } else {
            returnPromise.reject(err);
          }
        });
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  function chageSqlUnBind(id, SysUserRole) {
    let returnPromise = new cb.promise();
    let table = "GT3AT33.GT3AT33.test_HistoryUserRole";
    let billNum = "yb283c61f3";
    let object = {
      id,
      SysUserRole,
      BindFlag: "3",
      DelFlag: S4() + S4() + S4() + S4()
    };
    let req = { table, object, billNum };
    cb.rest.invokeFunction("GT34544AT7.common.updatesql", req, function (err, res) {
      if (res) {
        let dataorg = res.res;
        changechild(dataorg.id, SysUserRole).then((res, err) => {
          if (res) {
            returnPromise.resolve(res);
          } else {
            returnPromise.reject(err);
          }
        });
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  function changechild(id, SysUserRole) {
    let returnPromise = new cb.promise();
    let table = "GT3AT33.GT3AT33.test_HistoryOrg_UserRole";
    let condition = { test_HistoryOrg_UserRoleFk: id };
    let object = { SysUserRole };
    let billNum = "0c00829a";
    cb.rest.invokeFunction(
      "GT1559AT25.sync.syncGxyUserOrg",
      {
        table,
        condition,
        object,
        billNum
      },
      function (err, res) {
        if (res) {
          returnPromise.resolve(res);
        } else {
          returnPromise.reject(err);
        }
      }
    );
    return returnPromise;
  }
});
viewModel.get("button1cf") &&
  viewModel.get("button1cf").on("click", function (data) {
    // 按钮--单击
    let index = data.index;
    var currentRow = viewModel.getGridModel().getRow(index);
    let request = {};
    request.uri = "/yonbip/digitalModel/role/saveUser";
    let obj = {
      userId: currentRow.SysyhtUserId,
      tenantId: "yourIdHere",
      roleCode: currentRow.roleCode,
      roleId: currentRow.role,
      systemCode: "diwork",
      userCode: currentRow.SysUserCode
    };
    request.body = { userRole: obj };
    request.id = currentRow.id;
    cb.rest.invokeFunction("GT3AT33.role.saveUserRole", { request }, function (err, res) {
      if (res) {
        console.log("res", JSON.stringify(res));
      }
      if (err) {
        console.log("err", err);
      }
    });
  });