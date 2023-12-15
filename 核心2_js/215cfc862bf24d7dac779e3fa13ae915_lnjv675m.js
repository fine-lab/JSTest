viewModel.on("customInit", function (data) {
  function logs(msg) {
    let nmsg = msg;
    let bizFlowId = "yourIdHere";
    let bizFlowInstanceId = "yourIdHere";
    let queen = "";
    if (!!bizFlowId && !!bizFlowInstanceId) {
      queen += bizFlowId;
    } else {
      queen += "hellword";
    }
    let type = typeof msg;
    if (type == "string") {
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
    } else {
      let outmsg = JSON.stringify(msg);
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + outmsg;
      } else {
        nmsg = outmsg;
      }
    }
    cb.rest.invokeFunction("GT9912AT31.common.logQueen", { msg: nmsg, queen }, function (err, res) {});
  }
  var gridModel = viewModel.getGridModel();
  // 处理自动用户角色绑定--页面初始化
  gridModel.on("afterSetDataSource", (data) => {
    const rows = gridModel.getRows();
    console.log(rows);
    if (rows.length > 0) {
      let index = 0;
      for (let rowindex in rows) {
        let row = rows[rowindex];
        let roleCode = row.RoleCode;
        let userId = row.SysyhtUserId;
        console.log(roleCode);
        console.log(userId);
        console.log(row);
        let myid = row.id;
        console.log("myid = " + myid);
        if (row.BindFlag == "0" || row.BindFlag == 0) {
          binduserrole(row.id, roleCode, userId, row);
        }
        index++;
      }
    }
  });
  function refresh() {
    viewModel.execute("refresh");
  }
  var gridModel = viewModel.getGridModel();
  let mytime = setInterval(() => {
    refresh();
  }, 5000);
  function binduserrole(id, roleCode, userId, row) {
    let returnPromise = new cb.promise();
    let req = { roleCode, userId };
    if (!!roleCode && !!userId) {
      cb.rest.invokeFunction("GT34544AT7.roles.bindRole", req, function (err, res) {
        if (res) {
          console.log(res);
          logs("用户角色授权第一步:\n绑定用户角色返回值\n" + JSON.stringify(res) + "\n");
          let success = res.res.data;
          console.log("success = ");
          console.log(success);
          logs("success =>\n" + JSON.stringify(success) + "\n开始修改数据库 =>chageSql\n" + JSON.stringify(row));
          chageSql(id, success.id, row).then((res, err) => {
            if (res) {
              var uuid = row.SysyhtUserId;
              var roleid = row.role;
              var sysuser = row.SysUser;
              var { beginDate, endDate } = row;
              returnPromise.resolve(res);
            } else {
              returnPromise.reject(err);
            }
          });
        } else {
          returnPromise.reject(err);
        }
      });
    } else {
      returnPromise.resolve();
    }
    return returnPromise;
  }
  // 修改角色绑定
  function undateRole(id, SysUserRole, HistoryUserRole, HistoryOrg_UserRole) {
    let returnPromise = new cb.promise();
    let sql = "select * from GT3AT33.GT3AT33.test_Org_UserRole_AuthOrg where test_Org_UserRole_id='" + id + "'";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      let { recordList } = res;
      let clist = [];
      for (let i in recordList) {
        let org = recordList[i];
        let { id } = org;
        clist.push({ id, SysUserRole, _status: "Update" });
      }
      let table = "GT3AT33.GT3AT33.test_Org_UserRole";
      let list = [{ id, SysUserRole, HistoryUserRole, HistoryOrg_UserRole, test_Org_UserRole_AuthOrgList: clist }];
      let billNum = "yb7adb5197";
      logs("用户角色授权第四步C:\n同步角色授权主子表:准备更新 " + table + " \n" + JSON.stringify(list) + "\n");
      cb.rest.invokeFunction(
        "GT34544AT7.common.updateBatchSql",
        {
          table,
          list,
          billNum
        },
        function (err, res) {
          if (!!res) {
            logs("用户角色授权第四步D更新 " + table + "返回值 \n" + JSON.stringify(res) + "\n");
            returnPromise.resolve(res);
          } else returnPromise.reject(err);
        }
      );
    });
    return returnPromise;
  }
  function unbinduserrole(id, roleCode, userId, row) {
    let returnPromise = new cb.promise();
    let req = { roleCode, userId };
    cb.rest.invokeFunction("GT34544AT7.roles.unBindRole", req, function (err, res) {
      if (res) {
        console.log(res);
        let success = res.res.data;
        console.log(success);
        chageSqlUnBind(id, success.id, row).then((res, err) => {
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
  function chageSql(id, SysUserRole, row) {
    let returnPromise = new cb.promise();
    // 绑定后同步sysUserroleid到权限表
    let sql = "select id from GT3AT33.GT3AT33.test_Org_UserRole where HistoryUserRole='" + id + "'";
    logs("记录主表 id " + id);
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      if (res) {
        let { recordList } = res;
        var tours = [];
        for (let i in recordList) {
          var tour = recordList[i];
          tour._status = "Update";
          tour.SysUserRole = SysUserRole;
          tours.push(tour);
        }
        let req1 = { table: "GT3AT33.GT3AT33.test_Org_UserRole", list: tours, billNum: "yba2649675" };
        cb.rest.invokeFunction("GT34544AT7.common.updateBatchSql", req1, function (err, res1) {
          if (res1) {
            logs("用户角色授权第二步:\n更新test_Org_UserRole：角色授权表返回值\n" + JSON.stringify(res1) + "\n");
            let table = "GT3AT33.GT3AT33.test_HistoryUserRole";
            let billNum = "999d9d09";
            let object = {
              id,
              SysUserRole,
              BindFlag: "1"
            };
            let req2 = { table, object, billNum };
            cb.rest.invokeFunction("GT34544AT7.common.updatesql", req2, function (err, res2) {
              if (res2) {
                logs("用户角色授权第三步:\n更新自己返回值\n" + JSON.stringify(res2) + "\n");
                let dataorg = res2.res;
                logs("changechild id " + dataorg.id + "\n" + JSON.stringify(SysUserRole));
                changechild(dataorg.id, SysUserRole, row).then((res3, err) => {
                  if (res3) {
                    returnPromise.resolve(res3);
                  } else {
                    returnPromise.reject(err);
                  }
                });
              } else {
                returnPromise.reject(err);
              }
            });
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
  function chageSqlUnBind(id, SysUserRole, row) {
    let returnPromise = new cb.promise();
    let table = "GT3AT33.GT3AT33.test_HistoryUserRole";
    let billNum = "999d9d09";
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
        changechild(dataorg.id, SysUserRole, row).then((res, err) => {
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
  function changechild(id, SysUserRole, row) {
    let returnPromise = new cb.promise();
    let Org_UserRole = row.test_HistoryOrg_UserRoleList_Org_UserRole;
    logs("用户角色授权第四步A:\n查询到主表test_Org_UserRole的id:" + Org_UserRole + "\n");
    let sql = "select * from GT3AT33.GT3AT33.test_HistoryOrg_UserRole where test_HistoryOrg_UserRoleFk='" + id + "'";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      let { recordList } = res;
      logs("用户角色授权第四步B:\n查询到子表test_HistoryOrg_UserRole：返回值\n" + JSON.stringify(recordList) + "\n");
      let list = recordList[0];
      undateRole(Org_UserRole, SysUserRole, id, list.id);
      let table = "GT3AT33.GT3AT33.test_HistoryOrg_UserRole";
      let condition = { test_HistoryOrg_UserRoleFk: id };
      let object = { SysUserRole };
      let billNum = "0c00829a";
      let req1 = {
        table,
        condition,
        object,
        billNum
      };
      logs("用户角色授权第五步A:\n开始更新记录子表test_HistoryOrg_UserRole \n" + JSON.stringify(req1) + "\n");
      cb.rest.invokeFunction("GT1559AT25.sync.syncGxyUserOrg", req1, function (err, res) {
        if (res) {
          logs("用户角色授权第五步B:\n更新记录子表test_HistoryOrg_UserRole 返回值\n" + JSON.stringify(res) + "\n");
          returnPromise.resolve(res);
        } else {
          returnPromise.reject(err);
        }
      });
    });
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