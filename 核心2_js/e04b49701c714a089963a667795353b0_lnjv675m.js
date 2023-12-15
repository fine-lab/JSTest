viewModel.on("customInit", function (data) {
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
    console.log("requrl === ");
    console.log(requrl);
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
  // 封装业务get函数
  function apiget(params, options, action) {
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
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: requrl,
        method: "GET",
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
    console.log(staffRes);
    const mobile = staffRes.UserMobile.substring(4, 15);
    console.log(mobile);
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
        console.log(JSON.stringify(res));
        if (status == 0) {
          let uid = res.data.userId;
          saveuser(staffRes, staffRes.UserName, staffRes.UserMobile.substring(4, 15), uid).then((res, err) => {
            if (res) {
              returnPromise.resolve(res);
            } else {
              returnPromise.reject(err);
            }
          });
        } else {
          let userId = res.userId;
          saveGxsuser(userId, staffRes.SysStaffNew, staffRes.UserMobile.substring(4, 15), staffRes.id, staffRes.GxsStaffCode, staffRes).then((res, err) => {
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
  // 授权流程
  function authFunc(staffRes) {
    let returnPromise = new cb.promise();
    let staffcode = staffRes.AgentStaffCode;
    let last = staffcode.indexOf("_");
    let orgcode = staffcode.slice(0, last);
    let phone = staffRes.UserMobile.substring(4, 15);
    let allorgIds = [];
    // 编码获取下级组织
    getOrgChild(orgcode).then((res, err) => {
      if (!!res) {
        console.log(JSON.stringify(res));
        if (!!res.res.data[0]) {
          allorgIds.push("child://" + res.res.data[0].id);
          auth(phone, "gxs_AreaAdmin", allorgIds).then((res, err) => {
            if (res) {
              returnPromise.resolve(res);
            } else {
              returnPromise.reject(err);
            }
          });
        } else {
          returnPromise.reject("找不到组织");
        }
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 获取组织上级
  function getOrgParent(orgid) {
    let returnPromise = new cb.promise();
    cb.rest.invokeFunction("GT34544AT7.org.orgSearch", { id: orgid }, function (err, res) {
      if (res) {
        returnPromise.resolve(res.res);
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 获取下级组织单元
  function getOrgChild(orgCode) {
    let returnPromise = new cb.promise();
    let body = {
      code: orgCode
    };
    cb.rest.invokeFunction("GT34544AT7.org.sys_org_list_show", { body }, function (err, res) {
      if (res) {
        returnPromise.resolve(res);
      } else {
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 绑定用户
  function saveGxsuser(yhtuid, staff, phone, gxsstaff, gxsstaffcode, staffRes) {
    let returnPromise = new cb.promise();
    console.log("绑定用户流程:");
    console.log("yhtuid:" + yhtuid);
    console.log("staff:" + staff);
    console.log("phone:" + phone);
    console.log("gxsstaff:" + gxsstaff);
    console.log("gxsstaffcode:" + gxsstaffcode);
    let mystaff = gxsstaff;
    let staff1 = staff;
    cb.rest.invokeFunction("GT34544AT7.user.searchUserInfoByUid", { id: yhtuid }, function (err, res) {
      console.log("搜索用户流程:");
      console.log("yhtuid:" + yhtuid);
      let mystaff1 = mystaff;
      let staff2 = staff1;
      let userinfo = res.res.res.data[0];
      let userId = userinfo.userId;
      let userCode = userinfo.userCode;
      let userName = userinfo.userName;
      getUserinfo(phone).then((info, err) => {
        console.log("info:" + JSON.stringify(info));
        let mystaff2 = mystaff1;
        let staff3 = staff2;
        let userId1 = userId;
        let userCode1 = userCode;
        let uinfo = info.data.content[0];
        console.log("uinfo = ");
        console.log(uinfo);
        console.log("先绑定用户:");
        binduser(gxsstaffcode, userId, userCode, yhtuid, mystaff).then((res, err) => {
          console.log("绑定用户返回消息:");
          console.log(JSON.stringify(res));
          console.log(JSON.stringify(err));
          console.log("手机搜索用户流程:");
          console.log("phone:" + phone);
          if (res) {
            let uidx = JSON.stringify(uinfo.id);
            changeSqlIsUser(mystaff2, uidx, uinfo.userCode, uinfo.yhtUserId).then((res, err) => {
              if (!!res) {
                console.log("GxyCustomerUser修改后返回");
                console.log(res);
              } else {
                returnPromise.reject(err);
              }
            });
          }
        });
      });
    });
    return returnPromise;
  }
  // 删除身份
  function delUserBind(uinfo) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      isAjax: 1
    };
    let options = { isAjax: 1, tenantId: "yourIdHere" };
    let ids = [];
    ids.push(uinfo.id);
    let body = { tenantId: "yourIdHere", sysId: "yourIdHere", identitiyIds: ids };
    apipost(params, body, options, action).then((res, err) => {
      if (res) {
        console.log(JSON.stringify(res));
        returnPromise.resolve(res);
      } else {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 修改已生成用户参数
  function changeSqlIsUser(mystaff, userId, userCode, yhtuid) {
    let returnPromise = new cb.promise();
    let obj = {
      id: mystaff,
      isSync: "1",
      SysUser: userId,
      SysUserCode: userCode,
      SysyhtUserId: yhtuid
    };
    // 修改生成用户状态
    cb.rest.invokeFunction(
      "GT34544AT7.common.updatesql",
      {
        table: "GT34544AT7.GT34544AT7.GxsUser",
        object: obj,
        billNum: "a083a19d"
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
  // 同步用户信息
  function saveUserInfo(GxyCustomerStaff, GxyCustomerUser) {
    let returnPromise = new cb.promise();
    let obj = {
      id: GxyCustomerStaff,
      gxyCustomerUser: GxyCustomerUser
    };
    // 修改生成用户状态
    cb.rest.invokeFunction(
      "GT34544AT7.common.updatesql",
      {
        table: "GT1559AT25.GT1559AT25.GxyCustomerStaff",
        object: obj,
        billNum: "1f193fe1"
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
  // 绑定用户方法
  function binduser(gxsstaffcode, userId, userCode, yhtuid, mystaff) {
    let returnPromise = new cb.promise();
    var bindBody = {
      body: {
        staffCodeUserIdMap: {
          [gxsstaffcode]: yhtuid
        }
      }
    };
    let yhtuid1 = yhtuid;
    cb.rest.invokeFunction("GT34544AT7.staff.bindUserByStaffCode", bindBody, function (err, res) {
      let mystaff3 = mystaff;
      if (res) {
        returnPromise.resolve(res);
      } else {
        console.log("err:" + JSON.stringify(err));
        cb.utils.confirm(
          "绑定用户失败:" + err.message,
          function () {},
          function () {}
        );
        returnPromise.reject(err);
      }
    });
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
        console.log(JSON.stringify(res));
        returnPromise.resolve(res);
      } else {
        console.log(JSON.stringify(err));
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
        console.log(JSON.stringify(res));
        let userId = res.userId;
        saveGxsuser(userId, staffRes.SysStaffNew, staffRes.UserMobile.substring(4, 15), staffRes.id, staffRes.GxsStaffCode, staffRes).then((res, err) => {
          returnPromise.resolve(res);
        });
      } else {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 授权api
  // 用户角色授权
  function auth(mobile, rolecode, allorgIds) {
    let returnPromise = new cb.promise();
    let allroleIds = [];
    var stat = new Date();
    var refimestamp = stat.getTime();
    getAuthUserinfo(mobile, refimestamp, true).then((res, err) => {
      if (res) {
        getAuthUserinfo(mobile, refimestamp, false).then((res, err) => {
          if (res) {
            let userinfo = res.recordList[0];
            let yxyUserId = userinfo.id;
            let orgId = userinfo.orgId;
            let deptId = userinfo.deptId;
            let yhtUserId = userinfo.yhtUserId;
            let userCode = userinfo.code;
            // 授权获取用户角色信息
            getUserRole(yxyUserId).then((res, err) => {
              if (err) {
                returnPromise.reject(err);
              }
              if (res.length > 0) {
                for (let i in res) {
                  let roleinfo = res[i];
                  if (roleinfo.roleCode == rolecode) {
                    let orgdepts = roleinfo.resourceIds.orgdept;
                    for (let i in orgdepts) {
                      let have = orgdepts[i];
                      if (allorgIds.indexOf(have) < 0) {
                        allorgIds.push(have);
                      }
                    }
                    console.log("--------getUserRole---------");
                    console.log(allorgIds);
                  }
                  allroleIds.push(roleinfo.roleId);
                }
              }
              let orgId1 = orgId;
              // 获取gxs_AreaAdmin角色详情
              var stat = new Date();
              var refimestamp = stat.getTime();
              getRoleInfo(rolecode, refimestamp, true).then((res, err) => {
                if (res) {
                  getRoleInfo(rolecode, refimestamp, false).then((res, err) => {
                    if (res) {
                      let orgId2 = orgId1;
                      let roleinfo = res.recordList[0];
                      let roleid = roleinfo.id;
                      allroleIds.push(roleid);
                      // 用户新增角色
                      saveAuthUserRole(yxyUserId, yhtUserId, allroleIds).then((res, err) => {
                        if (err) {
                          returnPromise.reject(err);
                        } else {
                          saveRoleAuth(res.id, yhtUserId, roleid, allorgIds).then((res, err) => {
                            if (res) {
                              returnPromise.resolve(res);
                            } else {
                              returnPromise.reject(err);
                            }
                          });
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
  //封装的业务函数
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
    console.log("requrl === ");
    console.log(requrl);
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: requrl,
        method: "POST",
        options: options
      }
    });
    proxy.settle(reqParams, function (err, result) {
      if (result) {
        console.log(JSON.stringify(result));
        returnPromise.resolve(result);
      } else {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      }
    });
    return returnPromise;
  }
  // 封装业务get函数
  function apiget(params, options, action) {
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
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: requrl,
        method: "GET",
        options: options
      }
    });
    proxy.settle({}, function (err, result) {
      if (err) {
        console.log(err);
        returnPromise.reject(err);
      } else {
        returnPromise.resolve(result);
      }
    });
    return returnPromise;
  }
  // 分配角色主组织权限
  // 用户id,友互通id,角色id,分配组织id集合(包括已分配和新分配)
  function saveRoleAuth(yxyUserId, yhtUserId, roleId, orgIds) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      serviceCode: "u8c_GZTACT020",
      terminalType: 1
    };
    let body = getSaveRoleBody("orgdept", yxyUserId, yhtUserId, roleId, orgIds);
    let options = {
      domainKey: "yourKeyHere"
    };
    apipost(params, body, options, action).then((res, err) => {
      if (err) {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      } else {
        console.log(JSON.stringify(res));
        returnPromise.resolve(res);
      }
    });
    return returnPromise;
  }
  // 获取要保存分配的主组织权限信息
  function getSaveRoleBody(type, yxyUserId, yhtUserId, roleId, orgIds) {
    let auyhobjs = [];
    for (let i in orgIds) {
      let orgid = orgIds[i];
      let authobj = {
        resourceId: orgid,
        resourcetypecode: type,
        roleId: roleId,
        userId: yhtUserId,
        yxyUserId: yxyUserId
      };
      auyhobjs.push(authobj);
    }
    return auyhobjs;
  }
  // 授权分配用户角色
  //用户id，友互通id，角色Id
  function saveAuthUserRole(userId, yhtUserId, roleIds) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      serviceCode: "u8c_GZTACT020",
      terminalType: 1
    };
    let options = {
      domainKey: "yourKeyHere"
    };
    let body = {
      billnum: "sys_authority",
      userId: userId,
      roleIds: roleIds, //包括已分配和新分配
      yhtUserId: yhtUserId,
      userType: 1
    };
    apipost(params, body, options, action).then((res, err) => {
      if (err) {
        returnPromise.reject(err);
      } else {
        returnPromise.resolve(res);
      }
    });
    return returnPromise;
  }
  // 授权获取用户角色
  function getUserRole(userId) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      serviceCode: "u8c_GZTACT020",
      terminalType: 1,
      billnum: "sys_authority",
      userId: userId
    };
    let options = {
      domainKey: "yourKeyHere"
    };
    apiget(params, options, action).then((res, err) => {
      if (err) {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      } else {
        console.log(JSON.stringify(res));
        let roleOrgs = authUserRoleOrgToSaveUserRoleOrg(res);
        returnPromise.resolve(roleOrgs);
      }
    });
    return returnPromise;
  }
  // 用户角色组织权限信息接收转换成分配json
  function authUserRoleOrgToSaveUserRoleOrg(accept) {
    console.log(accept);
    let roleOrgs = [];
    let roles = accept.roles;
    for (let i in roles) {
      let role = roles[i];
      let roleId = role.id;
      let roleCode = role.code;
      let resourceIds = role.resourceIds;
      let keys = Object.keys(resourceIds);
      let typeOrgs = {};
      for (let i in keys) {
        let type = keys[i];
        let typedata = resourceIds[type];
        let orgIds = Object.keys(typedata);
        typeOrgs[type] = orgIds;
      }
      let roleOrg = {
        roleId: roleId,
        roleCode: roleCode,
        resourceIds: typeOrgs
      };
      roleOrgs.push(roleOrg);
    }
    return roleOrgs;
  }
  // 授权获取用户信息
  function getAuthUserinfo(phone, refimestamp, one) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT020",
      refimestamp: refimestamp,
      terminalType: 1
    };
    let body = one ? getSearchAuthUserBody(phone, refimestamp) : getSearchAuthUserBody1(phone, refimestamp);
    let options = {
      domainKey: "yourKeyHere"
    };
    apipost(params, body, options, action).then((res, err) => {
      if (err) {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      } else {
        console.log(JSON.stringify(res));
        returnPromise.resolve(res);
      }
    });
    return returnPromise;
  }
  // 授权获取角色信息
  function getRoleInfo(rolecode, refimestamp, one) {
    let returnPromise = new cb.promise();
    let action = "https://www.example.com/";
    let params = {
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT010",
      refimestamp: refimestamp,
      terminalType: 1
    };
    let body = one ? getSearchRoleBody(rolecode, refimestamp) : getSearchRoleBody1(rolecode, refimestamp);
    let options = {
      domainKey: "yourKeyHere"
    };
    apipost(params, body, options, action).then((res, err) => {
      if (err) {
        console.log(JSON.stringify(err));
        returnPromise.reject(err);
      } else {
        console.log(JSON.stringify(res));
        returnPromise.resolve(res);
      }
    });
    return returnPromise;
  }
  // 授权获取用户搜索json
  function getSearchAuthUserBody(phone, refimestamp) {
    let body = {
      page: {
        pageSize: 20,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "sys_authority",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "全部身份类型查询"
          },
          {
            itemName: "isDefault",
            value1: true
          },
          {
            value1: phone,
            itemName: "name"
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 1102956727
      },
      bClick: true,
      bEmptyWithoutFilterTree: false,
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT020",
      refimestamp: refimestamp,
      ownDomain: "u8c-auth",
      tplid: 7730018
    };
    return body;
  }
  // 授权获取用户搜索json
  function getSearchAuthUserBody1(phone, refimestamp) {
    let body = {
      page: {
        pageSize: 20,
        pageIndex: 1,
        totalCount: -1
      },
      billnum: "sys_authority",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "全部身份类型查询"
          },
          {
            itemName: "isDefault",
            value1: true
          },
          {
            value1: phone,
            itemName: "name"
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 1102956727
      },
      bClick: true,
      bEmptyWithoutFilterTree: false,
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT020",
      refimestamp: refimestamp,
      ownDomain: "u8c-auth",
      tplid: 7730018
    };
    return body;
  }
  // 授权获取code搜索角色json
  function getSearchRoleBody(rolecode, refimestamp) {
    let body = {
      page: {
        pageSize: 20,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "sys_rolelist",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "默认方案"
          },
          {
            itemName: "isDefault",
            value1: true
          },
          { value1: rolecode, itemName: "code" },
          {
            value1: "1",
            itemName: "sysRole"
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 1102482500
      },
      bClick: true,
      bEmptyWithoutFilterTree: false,
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT010",
      refimestamp: refimestamp,
      ownDomain: "u8c-auth",
      tplid: 6509852
    };
    return body;
  }
  function getSearchRoleBody1(rolecode, refimestamp) {
    let body = {
      page: {
        pageSize: 20,
        pageIndex: 1,
        totalCount: -1
      },
      billnum: "sys_rolelist",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "默认方案"
          },
          {
            itemName: "isDefault",
            value1: true
          },
          { value1: rolecode, itemName: "code" },
          {
            value1: "1",
            itemName: "sysRole"
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 1102482500
      },
      bClick: true,
      bEmptyWithoutFilterTree: false,
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT010",
      refimestamp: refimestamp,
      ownDomain: "u8c-auth",
      tplid: 6509852
    };
    return body;
  }
  function refresh() {
    viewModel.execute("refresh");
  }
  var gridModel = viewModel.getGridModel();
  let mytime = setInterval(() => {
    console.log("开始刷新");
    refresh();
    console.log("刷新完成");
  }, 10000);
  gridModel.on("afterSetDataSource", (data) => {
    const rows = gridModel.getRows();
    console.log(rows);
    if (rows.length > 0) {
      for (let row in rows) {
        if (row.isSync == "0" && row.submitEnable == "1") {
          addSysUser(row).then((res, err) => {
            if (res) {
              console.log(res);
            }
          });
        }
      }
    }
  });
});