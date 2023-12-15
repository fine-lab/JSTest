viewModel.on("customInit", function (data) {
  function refresh() {
    viewModel.execute("refresh");
  }
  let mytime = setInterval(() => {
    refresh();
  }, 5000);
  // 设置有效期
});
viewModel.get("test_history_authorg_1647235303823900673") &&
  viewModel.get("test_history_authorg_1647235303823900673").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    var gridModel = viewModel.get("test_history_authorg_1647235303823900673");
    const rows = gridModel.getRows();
    if (rows.length > 0) {
      logs(rows);
      let index = 0;
      auth(rows);
    }
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
    // 自动授权页面--页面初始化
    function apipost(params, reqParams, options, action) {
      let returnPromise = new cb.promise();
      var url = action;
      var suf = "?";
      let keys = Object.keys(params);
      let plen = keys.length;
      for (let num = 0; num < plen; num++) {
        let key = keys[num];
        let value = params[key];
        if (num < plen - 1) {
          suf += key + "=" + value + "&";
        } else {
          suf += key + "=" + value;
        }
      }
      var requrl = url + suf;
      logs("requrl === ");
      logs(requrl);
      var proxy = cb.rest.DynamicProxy.create({
        settle: {
          url: requrl,
          method: "POST",
          options: options
        }
      });
      proxy.settle(reqParams, function (err, result) {
        if (err) {
          returnPromise.reject(err);
        } else {
          returnPromise.resolve(result);
        }
      });
      return returnPromise;
    }
    function auth(rows) {
      console.log("in auth");
      console.log("rows ", rows);
      var auths = {};
      var orgs = {};
      var delorgs = {};
      var unbinded = {};
      // 用上级来分类
      for (let i in rows) {
        let row = rows[i];
        let yxyUserId = row.SysUser;
        let yhtUserId = row.SysyhtUserId;
        let roleId = row.role;
        let AuthOrg = row.AuthOrg;
        console.log(" !!yxyUserId&&!!yhtUserId&&!!roleId&&!!AuthOrg ", !!yxyUserId && !!yhtUserId && !!roleId && !!AuthOrg);
        if (!!yxyUserId && !!yhtUserId && !!roleId && !!AuthOrg) {
          let key = yxyUserId + ":" + yhtUserId + ":" + roleId + ":" + AuthOrg;
          if (!!row.UserManageOrg && row.Binded == "0") {
            if (!orgs[key]) {
              orgs[key] = [];
            }
            if (row.ContainSubFlag == "0") {
              orgs[key].push(row.UserManageOrg);
            } else if (row.ContainSubFlag == "1") {
              orgs[key].push("child://" + row.UserManageOrg);
            }
            if (!auths[key]) {
              auths[key] = [];
              auths[key].push(row);
            } else {
              auths[key].push(row);
            }
          } else if (!!row.UserManageOrg && row.Binded == "2") {
            if (!delorgs[key]) {
              delorgs[key] = [];
            }
            if (row.ContainSubFlag == "0") {
              delorgs[key].push(row.UserManageOrg);
            } else if (row.ContainSubFlag == "1") {
              delorgs[key].push("child://" + row.UserManageOrg);
            }
            if (!unbinded[key]) {
              unbinded[key] = [];
              unbinded[key].push(row);
            } else {
              unbinded[key].push(row);
            }
          }
        }
      }
      // 绑定主组织
      var orgkeys = Object.keys(orgs);
      for (let i in orgkeys) {
        setTimeout(function () {
          var orgkey = orgkeys[i];
          var strs = orgkey.split(":");
          var yxyUserId = strs[0];
          var yhtUserId = strs[1];
          var roleId = strs[2];
          var orgIds = orgs[orgkey];
          if (!!yxyUserId && !!yhtUserId && !!roleId && orgIds.length > 0) {
            saveRoleAuth(yxyUserId, yhtUserId, roleId, orgIds).then((res, err) => {
              // 设置有效期
            });
          } else {
            logs("没有查询到有效数据");
          }
        }, 100);
      }
      // 修改绑定主组织
      var authskeys = Object.keys(auths);
      for (let i in authskeys) {
        var authkey = authskeys[i];
        var change = auths[authkey];
        sqlBindchange(change).then((res, err) => {
          logs("sqlBindchange");
          logs(res);
        });
      }
      // 解绑主组织
      var delorgkeys = Object.keys(delorgs);
      for (let i in delorgkeys) {
        var orgkey = delorgkeys[i];
        var strs = orgkey.split(":");
        var yxyUserId = strs[0];
        var yhtUserId = strs[1];
        var roleId = strs[2];
        var orgIds = delorgs[orgkey];
        delRoleAuth(yxyUserId, yhtUserId, roleId, orgIds);
      }
      // 修改解绑主组织
      var unbindedkeys = Object.keys(unbinded);
      for (let i in unbindedkeys) {
        var authkey = unbindedkeys[i];
        var change = unbinded[authkey];
        sqlUnBindchange(change).then((res, err) => {
          logs("sqlUnBindchange");
          logs(res);
        });
      }
    }
    // 修改数据库已绑定
    function sqlBindchange(rows) {
      let returnPromise = new cb.promise();
      let table = "GT3AT33.GT3AT33.test_History_AuthOrg";
      let billNum = "yb7c00a444";
      let objects = [];
      for (let i in rows) {
        var id = rows[i].id;
        var Binded = "1";
        var obj = { id, Binded };
        objects.push(obj);
      }
      cb.rest.invokeFunction(
        "GT34544AT7.common.upOrInsertAllSql",
        { table, billNum, objects },
        function (err, res) {
          if (err) {
            logs(JSON.stringify(err));
            returnPromise.reject(err);
          } else {
            logs(JSON.stringify(res));
            returnPromise.resolve(res);
          }
        },
        viewModel,
        { domainKey: "yourKeyHere" }
      );
      return returnPromise;
    }
    // 修改数据库已解绑
    function sqlUnBindchange(rows) {
      let returnPromise = new cb.promise();
      let table = "GT3AT33.GT3AT33.test_History_AuthOrg";
      let billNum = "yb7c00a444";
      let objects = [];
      for (let i in rows) {
        var id = rows[i].id;
        var Binded = "3";
        var obj = { id, Binded };
        objects.push(obj);
      }
      cb.rest.invokeFunction(
        "GT34544AT7.common.upOrInsertAllSql",
        { table, billNum, objects },
        function (err, res) {
          if (err) {
            logs(JSON.stringify(err));
            returnPromise.reject(err);
          } else {
            logs(JSON.stringify(res));
            returnPromise.resolve(res);
          }
        },
        viewModel,
        { domainKey: "yourKeyHere" }
      );
      return returnPromise;
    }
    // 删除角色主组织权限
    // 用户id,友互通id,角色id,删除组织id集合
    function delRoleAuth(yxyUserId, yhtUserId, roleId, orgIds) {
      let returnPromise = new cb.promise();
      let action = "https://www.example.com/";
      let params = {
        serviceCode: "u8c_GZTACT020",
        terminalType: 1
      };
      let body = getSaveRoleBody(yxyUserId, yhtUserId, roleId, [], orgIds);
      let options = {
        domainKey: "yourKeyHere"
      };
      apipost(params, body, options, action).then((res, err) => {
        if (err) {
          logs(JSON.stringify(err));
          returnPromise.reject(err);
        } else {
          logs(JSON.stringify(res));
          returnPromise.resolve(res);
        }
      });
      return returnPromise;
    }
    // 分配角色主组织权限
    // 用户id,友互通id,角色id,分配组织id集合
    function saveRoleAuth(yxyUserId, yhtUserId, roleId, orgIds) {
      let returnPromise = new cb.promise();
      let action = "https://www.example.com/";
      let params = {
        serviceCode: "u8c_GZTACT020",
        terminalType: 1
      };
      let body = getSaveRoleBody(yxyUserId, yhtUserId, roleId, orgIds, []);
      let options = {
        domainKey: "yourKeyHere"
      };
      apipost(params, body, options, action).then((res, err) => {
        if (err) {
          logs(JSON.stringify(err));
          returnPromise.reject(err);
        } else {
          logs(JSON.stringify(res));
          returnPromise.resolve(res);
        }
      });
      return returnPromise;
    }
    // 获取要保存分配的主组织权限信息
    function getSaveRoleBody(yxyUserId, yhtUserId, roleId, addorgIds, delorgIds) {
      var bady = {
        resources: [
          {
            add: addorgIds,
            del: delorgIds,
            isLazyLoad: false,
            resourceFunction: "orgunit",
            resourcetypecode: "orgdept"
          }
        ],
        roleId: roleId,
        userId: yhtUserId,
        yxyUserId: yxyUserId
      };
      return bady;
    }
    // 设置结束时间
    function setEndDate(uuid, roleid, sysuser, Org_UserRole_AuthOrg) {
      let returnPromise = new cb.promise();
      if (!!Org_UserRole_AuthOrg) {
        var sql =
          "select id Org_UserRole_AuthOrg,tos.enddate from GT3AT33.GT3AT33.test_Org_UserRole_AuthOrg " +
          "left join GT3AT33.GT3AT33.test_Org_UserRole as tour on tour.id=test_Org_UserRole_id " +
          "left join GT3AT33.GT3AT33.test_OrderServiceUseOrg as tosur on tosur.id=tour.test_OrderServiceUseOrg " +
          "left join GT3AT33.GT3AT33.test_OrderService as tos on tos.id=tosur.test_OrderService_id " +
          "where id='" +
          Org_UserRole_AuthOrg +
          "' and tour.test_OrderServiceUseOrg is not null and tos.enddate is not null";
        cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
          if (err) {
            logs("授权获取结束时间错误");
            logs(JSON.stringify(err));
            returnPromise.reject(err);
          } else {
            logs("授权获取到结束时间");
            logs(res.recordList[0]);
            if (!!res.recordList[0]) {
              var { tos_enddate } = res.recordList[0];
              cb.rest.invokeFunction(
                "GT9912AT31.common.dataAdd",
                {
                  type: "sysdate"
                },
                function (err, res) {
                  var datastr = res.res.acc;
                  var datastr1 = datastr.substr(0, 10);
                  var enddate = tos_enddate.substr(0, 10);
                }
              );
            } else {
              logs("授权未获取到结束时间");
            }
            returnPromise.resolve(res);
          }
        });
      }
      return returnPromise;
    }
  });