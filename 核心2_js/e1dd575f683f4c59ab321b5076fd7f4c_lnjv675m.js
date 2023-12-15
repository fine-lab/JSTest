viewModel.on("customInit", function (data) {
  // 日志方法
  function log(msg) {
    console.log(msg);
  }
  // 后台自动生成用户--页面初始化
  // 封装的业务函数
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
    log("requrl === ");
    log(requrl);
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
  function getvdata(staffRes) {
    log(JSON.stringify(staffRes));
    const mobile = staffRes.UserMobile.substring(4, 15);
    log(mobile);
    let body = {
      tenantId: "yourIdHere",
      userInfo: {
        userCode: "",
        userName: staffRes.UserName,
        userMobile: mobile,
        userEmail: staffRes.UserEmail,
        userId: "",
        external: false,
        remarkName: "",
        userType: "1",
        identityArr: [
          {
            userType: 1,
            stopStatus: 0,
            archivesId: [null]
          }
        ]
      }
    };
    return body;
  }
  // 获取创建用户的参数
  function getsdata(name, mobile, userid) {
    let body = {
      tenantId: "yourIdHere",
      userInfo: {
        userCode: "",
        userName: name,
        userMobile: mobile,
        userEmail: "",
        userId: userid,
        external: false,
        remarkName: "",
        userType: "1",
        identityArr: [
          {
            userType: 1,
            stopStatus: 0,
            archivesId: [null]
          }
        ]
      }
    };
    return body;
  }
  // 创建系统用户
  function addSysUser(staffRes) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      isAjax: 1
    };
    let vbody = getvdata(staffRes);
    let options = {
      isajax: 1,
      tenantid: "youridHere"
    };
    apipost(params, vbody, options, action).then((res, err) => {
      if (res) {
        let status = res.status;
        log(JSON.stringify(res));
        if (status == 0) {
          log("DEBUG---------");
          // 如果uid存在即用户没有在系统里面
          if (!!res.data && !!res.data.userId) {
            let uid = res.data.userId;
            saveuser(staffRes, staffRes.UserName, staffRes.UserMobile.substring(4, 15), uid).then((res, err) => {
              if (res) {
                returnPromise.resolve(res);
              } else {
                returnPromise.reject(err);
              }
            });
          } else {
            let phone = staffRes.UserMobile.substring(4, 15);
            // 用户已经存在逻辑
            getUserinfo(phone).then((info, err) => {
              log("info:" + JSON.stringify(info));
              let uinfo = info.data.content[0];
              log(info.data.msg);
              let mystaff2 = staffRes.id;
              let staff3 = staffRes.SysStaffNew;
              let userId1 = uinfo.yhtUserId;
              let userCode1 = uinfo.userCode;
              let uidx = uinfo.id;
              log("addSysUser=>getUserinfo后开始修改自建sql信息");
              changeSqlIsUser(mystaff2, uidx, userCode1, userId1, staffRes.GxyUserCreateType, staffRes).then((res, err) => {
                if (!!res) {
                  log("GxyUser修改后返回");
                  log(JSON.stringify(res));
                  returnPromise.resolve(res);
                } else {
                  returnPromise.reject(err);
                }
              });
            });
          }
        } else {
          let userId = res.userId;
          saveGxsuser(userId, staffRes.SysStaffNew, staffRes.UserMobile.substring(4, 15), staffRes.id, staffRes.SysStaffNewCode, staffRes).then((res, err) => {
            if (res) {
              returnPromise.resolve(res);
            } else {
              returnPromise.reject(err);
            }
          });
        }
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 绑定用户
  function saveGxsuser(yhtuid, staff, phone, gxsstaff, SysStaffNewCode, staffRes) {
    let returnPromise = new cb.promise();
    log("绑定用户流程:\nyhtuid:" + yhtuid + "\nstaff:" + staff + "\nphone:" + phone + "\ngxsstaff:" + gxsstaff + "\nSysStaffNewCode:" + SysStaffNewCode + "\n");
    let mystaff = gxsstaff;
    let staff1 = staff;
    cb.rest.invokeFunction("GT34544AT7.user.searchUserInfoByUid", { id: yhtuid }, function (err, res) {
      log("搜索用户流程:\nyhtuid:" + yhtuid + "\n");
      let mystaff1 = mystaff;
      let staff2 = staff1;
      let userinfo = res.res.res.data[0];
      let userId = userinfo.userId;
      let userCode = userinfo.userCode;
      let userName = userinfo.userName;
      // 手机号获取系统用户信息
      getUserinfo(phone).then((info, err) => {
        let mystaff2 = mystaff1;
        let staff3 = staff2;
        let userId1 = userId;
        let userCode1 = userCode;
        let uinfo = info.data.content[0];
        log("info:" + JSON.stringify(info) + "\nuinfo = \n" + JSON.stringify(uinfo) + "\nsaveGxsuser=>getUserinfo后开始修改自建sql信息 \n" + "staffRes = " + JSON.stringify(staffRes) + "\n");
        let uidx = uinfo.id;
        var phone = staffRes.UserMobile;
        var sqlArea =
          "select id,GxsStaffFk from GT34544AT7.GT34544AT7.gxsAreaAdmin where mobile='" + phone + "' and " + "(StaffNewSysyhtUserId is null or StaffNewSysyhtUserId=0 or StaffNewSysyhtUserId='0')";
        var sqlOrg =
          "select id,GxsStaffFk from GT34544AT7.GT34544AT7.gxsOrgAdmin where mobile='" + phone + "' and " + "(StaffNewSysyhtUserId is null or StaffNewSysyhtUserId=0 or StaffNewSysyhtUserId='0')";
        var sqlRole = "select id from GT3AT33.GT3AT33.test_Org_UserRole where mobile='" + phone + "' and SysyhtUserId is null";
        // 开始查询区域管理员
        let arearesult = cb.rest.invokeFunction(
          "GT34544AT7.common.selectAuthRole",
          {
            sql: sqlArea
          },
          function (err, res) {},
          viewModel,
          { async: false }
        );
        console.log("selectAuthRole GT34544AT7.GT34544AT7.gxsAreaAdmin end");
        console.log(arearesult);
        let { recordList } = arearesult.result;
        log("查询到区域管理员 \n" + JSON.stringify(recordList) + "\n");
        if (recordList.length > 0) {
          let sid1 = "" + recordList[0].GxsStaffFk;
          for (let i in recordList) {
            recordList[i].StaffNewSysyhtUserId = userId1;
            recordList[i]._status = "Update";
            delete recordList[i].GxsStaffFk;
          }
          var objs = [{ id: sid1, gxsAreaAdminList: recordList }];
          let sqlresultarea = cb.rest.invokeFunction(
            "GT34544AT7.common.updateBatchSql",
            { list: objs, table: "GT34544AT7.GT34544AT7.GxsStaff", billNum: "ybfe5079ea" },
            function (err, res) {},
            viewModel,
            { async: false }
          );
        }
        // 开始查询单位管理员
        let orgresult = cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql: sqlOrg }, function (err, res) {}, viewModel, { async: false });
        console.log("selectAuthRole GT34544AT7.GT34544AT7.gxsOrgAdmin end");
        console.log(orgresult);
        let recordList1 = orgresult.result.recordList;
        log("查询到单位管理员 \n" + JSON.stringify(recordList1) + "\n");
        if (recordList1.length > 0) {
          let sid2 = "" + recordList1[0].GxsStaffFk;
          for (let i in recordList1) {
            recordList1[i].StaffNewSysyhtUserId = userId1;
            recordList1[i].SysyhtUserId = userId1;
            recordList1[i].SysUser = uidx;
            recordList1[i].SysUserCode = userCode;
            recordList1[i]._status = "Update";
            delete recordList1[i].GxsStaffFk;
          }
          var objs1 = [{ id: sid2, gxsOrgAdminList: recordList1 }];
          let sqlresultorg = cb.rest.invokeFunction(
            "GT34544AT7.common.updateBatchSql",
            { list: objs1, table: "GT34544AT7.GT34544AT7.GxsStaff", billNum: "ybfe5079ea" },
            function (err, res) {},
            viewModel,
            { async: false }
          );
        }
        changeSqlIsUser(mystaff2, uidx, uinfo.userCode, uinfo.yhtUserId, staffRes.GxyUserCreateType, staffRes).then((res, err) => {
          if (!!res) {
            log("GxyUser修改后返回");
            log(JSON.stringify(res));
          } else {
            returnPromise.reject(err);
          }
        });
      });
    });
    return returnPromise;
  }
  // 修改gxsstaff
  function changeGxsStaff(id, uuid) {
    var sql = "select id from GT34544AT7.GT34544AT7.GxsStaff where id='" + id + "'";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      log("查询到res==>");
      log(JSON.stringify(res));
      var { recordList } = res;
      log(JSON.stringify(recordList[0]));
      var id = recordList[0].id;
      let obj = { id, sysUserid: uuid };
      cb.rest.invokeFunction(
        "GT34544AT7.common.updatesql",
        {
          table: "GT34544AT7.GT34544AT7.GxsStaff",
          object: obj,
          billNum: "ybb1f610ec"
        },
        function (err, res) {
          log("GxsStaff修改后返回");
          log(err);
          log(res);
        }
      );
    });
  }
  // 修改已生成用户参数
  function changeSqlIsUser(mystaff, userId, userCode, yhtuid, state, staffRes) {
    let returnPromise = new cb.promise();
    let obj = {
      id: mystaff,
      SysUser: "" + userId,
      SysUserCode: userCode,
      SysyhtUserId: yhtuid
    };
    log("sql obj = " + JSON.stringify(obj));
    log(typeof userId);
    log("userId = " + userId);
    // 修改生成用户状态
    cb.rest.invokeFunction(
      "GT34544AT7.common.updatesql",
      {
        table: "GT1559AT25.GT1559AT25.GxyUser",
        object: obj,
        billNum: "cfdec807"
      },
      function (err, res) {
        if (res) {
          log("修改生成用户状态 返回 " + JSON.stringify(res));
          log("开始 addChild  \nmystaff=" + mystaff + " \nuserId=" + userId + " \nyhtuid=" + yhtuid + " \nstate=" + state + " \nstaffRes=" + JSON.stringify(staffRes) + "\n");
          addChild(mystaff, "" + userId, userCode, yhtuid, state, staffRes).then((res, err) => {
            if (!!res) {
              returnPromise.resolve(res);
            } else {
              returnPromise.reject(err);
            }
          });
        } else {
          log("修改生成用户状态没有成功=>err:\n" + err);
          returnPromise.reject(err);
        }
      }
    );
    return returnPromise;
  }
  // 生成子表
  function addChild(staffid, sysuserId, sysuserCode, SysyhtUserId, state, staffRes) {
    let returnPromise = new cb.promise();
    // 手机号查找子表
    searchchildBymobile(staffRes.UserMobile).then((res, err) => {
      if (!!res) {
        let ress = res.res;
        log("手机号查找子表:searchchildBymobile 返回\n" + JSON.stringify(res) + "\n");
        if (ress.length > 0) {
          let max = ress.length;
          let num = 0;
          for (let i in ress) {
            let ele = ress[i];
            // 同步授权表
            let req = {
              gxyUserID: staffid,
              gxyUserOrg: ele.id,
              SysyhtUserId: SysyhtUserId,
              SysUser: "" + sysuserId,
              SysUserCode: sysuserCode,
              mobile: staffRes.UserMobile
            };
            log("res 返回\n" + JSON.stringify(req) + "\n");
            // 同步授权表
            WritebackSysUser(req).then((res, err) => {
              log("同步授权表返回");
              log(res);
              log(err);
              // 同步更新子表
              log(
                "开始 upchild  gxyUserOrg=" +
                  ele.id +
                  " \nstaffid=" +
                  staffid +
                  " \nsysuserId=" +
                  sysuserId +
                  " \nsysuserCode=" +
                  sysuserCode +
                  " \nSysyhtUserId= " +
                  SysyhtUserId +
                  " \nstate=" +
                  state +
                  " \nstaffRes=" +
                  JSON.stringify(staffRes) +
                  "\n"
              );
              upchild(ele.id, staffid, sysuserId, sysuserCode, SysyhtUserId, state, staffRes).then((res, err) => {
                if (!!res) {
                  num++;
                  if (max == num) {
                    returnPromise.resolve();
                  }
                } else {
                  returnPromise.reject();
                }
              });
            });
          }
        }
      } else {
        log("手机号查找子表失败");
      }
    });
    return returnPromise;
  }
  // 手机号查找子表
  function searchchildBymobile(mobile) {
    let returnPromise = new cb.promise();
    let table = "GT1559AT25.GT1559AT25.GxyUserOrg";
    let conditions = {
      UserMobile: mobile
    };
    cb.rest.invokeFunction(
      "GT34544AT7.common.selectSqlByMapX",
      {
        table,
        conditions
      },
      function (err, res) {
        if (!!res) {
          returnPromise.resolve(res);
        } else {
          returnPromise.reject();
        }
      }
    );
    return returnPromise;
  }
  // 更新子表
  function upchild(id, staffid, sysuserId, sysuserCode, SysyhtUserId, state, staffRes) {
    let returnPromise = new cb.promise();
    let table = "GT1559AT25.GT1559AT25.GxyUserOrg";
    let obj = {
      id,
      GxyUserOrgFk: staffid,
      SysUser: sysuserId,
      SysUserCode: sysuserCode,
      SysyhtUserId: SysyhtUserId,
      _status: "Update"
    };
    log("待添加子表 " + JSON.stringify(obj) + "\n");
    cb.rest.invokeFunction(
      "GT34544AT7.common.updatesql",
      {
        table,
        object: obj,
        billNum: "ybbe422218"
      },
      function (err, res) {
        if (res) {
          log("添加子表返回 " + JSON.stringify(res));
          log(
            "开始 addGrandChild  \nres.id=" +
              res.id +
              " \nsysuserId=" +
              sysuserId +
              " \nsysuserCode=" +
              sysuserCode +
              " \nSysyhtUserId=" +
              SysyhtUserId +
              " \nstate= " +
              state +
              " \nstaffRes=" +
              JSON.stringify(staffRes) +
              "\n"
          );
          addGrandChild(res.id, sysuserId, sysuserCode, SysyhtUserId, state, staffRes).then((res, err) => {
            if (!!res) {
              returnPromise.resolve(res);
            }
          });
        } else {
          returnPromise.reject(err);
        }
      }
    );
    return returnPromise;
  }
  // 同步授权表
  function WritebackSysUser(req) {
    let returnPromise = new cb.promise();
    log("开始 WritebackSysUser");
    cb.rest.invokeFunction("GT9912AT31.auth.WritebackSysUser", req, function (err, res) {
      if (res) {
        log(" WritebackSysUser 返回 " + JSON.stringify(res) + "\n");
        returnPromise.resolve(res);
      } else {
        returnPromise.reject();
      }
    });
    return returnPromise;
  }
  // 生成用户孙表
  function addGrandChild(childid, sysuserId, sysuserCode, SysyhtUserId, state, staffRes) {
    let returnPromise = new cb.promise();
    let table = "GT1559AT25.GT1559AT25.GxyUserStaffJobNew";
    let billNum = "8cb17715";
    let fkey = "yourkeyHere";
    switch (state) {
      case 1:
      case "1":
        // 员工用户孙表
        table = "GT1559AT25.GT1559AT25.GxyUserStaffJobNew";
        billNum = "8cb17715";
        fkey = "yourkeyHere";
        break;
      case 2:
      case "2":
        // 社员用户孙表
        table = "GT1559AT25.GT1559AT25.GxyUserMember";
        billNum = "527acb27";
        fkey = "yourkeyHere";
        break;
    }
    log("手机号查找用户孙表");
    // 手机号查找用户孙表
    searchGrandChild(table, staffRes.UserMobile).then((res, err) => {
      if (!!res) {
        let ress = res.res;
        log("手机号查找用户孙表 返回\n" + JSON.stringify(res) + "\n");
        if (ress.length > 0) {
          let max = ress.length;
          let num = 0;
          for (let i in ress) {
            let ele = ress[i];
            setTimeout(function () {
              log("开始changeGxsStaff \n" + JSON.stringify(ele.GxyStaffid) + " \n SysyhtUserId=" + SysyhtUserId);
              changeGxsStaff(ele.GxyStaffid, SysyhtUserId);
            }, i * 100);
            // 更新关联的孙表
            log("开始updateGrandChild ");
            updateGrandChild(ele.id, fkey, childid, sysuserId, sysuserCode, SysyhtUserId, table, billNum).then((res, err) => {
              if (res) {
                num++;
                if (max == num) {
                  returnPromise.resolve();
                }
              } else {
                returnPromise.reject(err);
              }
            });
          }
        }
      }
    });
    return returnPromise;
  }
  // 更新用户孙表
  function updateGrandChild(id, fkey, childid, sysuserId, sysuserCode, SysyhtUserId, table, billNum) {
    let returnPromise = new cb.promise();
    let obj = {
      id,
      [fkey]: childid,
      SysUser: sysuserId,
      SysUserCode: sysuserCode,
      SysyhtUserId: SysyhtUserId,
      _status: "Update"
    };
    log("待更改孙表 " + JSON.stringify(obj));
    cb.rest.invokeFunction(
      "GT34544AT7.common.updatesql",
      {
        table,
        object: obj,
        billNum
      },
      function (err, res) {
        if (res) {
          log("更改孙表 返回" + JSON.stringify(res));
          returnPromise.resolve(res);
        } else {
          returnPromise.reject(err);
        }
      }
    );
    return returnPromise;
  }
  // 手机号查找用户孙表
  function searchGrandChild(table, mobile) {
    let returnPromise = new cb.promise();
    let conditions = {
      UserMobile: mobile
    };
    cb.rest.invokeFunction(
      "GT34544AT7.common.selectSqlByMapX",
      {
        table,
        conditions
      },
      function (err, res) {
        if (!!res) {
          returnPromise.resolve(res);
        } else {
          returnPromise.reject();
        }
      }
    );
    return returnPromise;
  }
  // 获取用户详细信息
  function getUserinfo(nameorphone) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      isAjax: 1
    };
    let sbody = {
      pageSize: 10,
      pageNum: 1,
      type: "",
      search: nameorphone,
      resCode: "diwork",
      tenantId: "yourIdHere",
      orgIds: []
    };
    let options = {
      isajax: 1,
      tenantid: "youridHere"
    };
    apipost(params, sbody, options, action).then((res, err) => {
      if (res) {
        log(JSON.stringify(res));
        returnPromise.resolve(res);
      } else {
        log(JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 存储用户
  function saveuser(staffRes, name, mobile, uid) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      isAjax: 1
    };
    let sbody = getsdata(name, mobile, uid);
    let options = {
      isajax: 1,
      tenantid: "youridHere"
    };
    apipost(params, sbody, options, action).then((res, err) => {
      if (res) {
        log(JSON.stringify(res));
        let userId = res.userId;
        saveGxsuser(userId, staffRes.SysStaffNew, staffRes.UserMobile.substring(4, 15), staffRes.id, staffRes.SysStaffNewCode, staffRes).then((res, err) => {
          returnPromise.resolve(res);
        });
      } else {
        log(JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  function refresh() {
    viewModel.execute("refresh");
  }
  var gridModel = viewModel.getGridModel();
  let mytime = setInterval(() => {
    refresh();
  }, 5000);
  gridModel.on("afterSetDataSource", (data) => {
    const rows = gridModel.getRows();
    if (rows.length > 0) {
      log(rows);
      let index = 0;
      for (let rowindex in rows) {
        let row = rows[rowindex];
        setTimeout(function () {
          addSysUser(row).then((res, err) => {
            if (res) {
              log(res);
            }
          });
        }, index * 100);
        index++;
      }
    }
  });
  viewModel.get("button1jh").on("click", function (data) {
    // 执行--单击
    log(data);
    var gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    var i = data.index;
    let row = rows[i];
    addSysUser(row).then((res, err) => {
      if (res) {
        log(res);
      }
    });
  });
});