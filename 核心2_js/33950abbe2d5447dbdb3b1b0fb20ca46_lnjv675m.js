viewModel.get("button27tj") &&
  viewModel.get("button27tj").on("click", function (data) {
    // 同步--单击
    let conditions = "1=1";
    let table = "GT1559AT25.GT1559AT25.GxyUser";
    cb.rest.invokeFunction("GT34544AT7.common.selectSqlApi", { conditions, table }, function (err, res) {
      console.log(res);
      let ress = res.res;
      let max = ress.length;
      let num = 0;
      let index = 0;
      console.log("开始同步子表");
      for (let i in ress) {
        setTimeout(function () {
          let ele = ress[i];
          let UserMobile = ele.UserMobile;
          let table = "GT1559AT25.GT1559AT25.GxyUserOrg";
          let condition = { UserMobile };
          let billNum = "fd0e5d97";
          let SysUser = ele.SysUser;
          let SysUserCode = ele.SysUserCode;
          let SysyhtUserId = ele.SysyhtUserId;
          let object = {
            SysUser,
            SysUserCode,
            SysyhtUserId
          };
          cb.rest.invokeFunction("GT1559AT25.sync.syncGxyUserOrg", { table, condition, object, billNum }, function (err, res) {
            let index1 = index + 1;
            console.log("第" + index1 + "条");
            console.log(res);
            index++;
            if (index == max) {
              index = 0;
              console.log("开始同步员工孙表");
            }
          });
        }, num * 100);
        num++;
      }
      for (let i in ress) {
        setTimeout(function () {
          let ele = ress[i];
          let UserMobile = ele.UserMobile;
          let table = "GT1559AT25.GT1559AT25.GxyUserStaffJobNew";
          let condition = { UserMobile };
          let billNum = "8cb17715";
          let SysUser = ele.SysUser;
          let SysUserCode = ele.SysUserCode;
          let SysyhtUserId = ele.SysyhtUserId;
          let object = {
            SysUser,
            SysUserCode,
            SysyhtUserId
          };
          cb.rest.invokeFunction("GT1559AT25.sync.syncGxyUserOrg", { table, condition, object, billNum }, function (err, res) {
            let index1 = index + 1;
            console.log("第" + index1 + "条");
            console.log(res);
            index++;
            if (index == max) {
              index = 0;
              console.log("开始同步社员孙表");
            }
          });
        }, num * 100);
        num++;
      }
      for (let i in ress) {
        setTimeout(function () {
          let ele = ress[i];
          let UserMobile = ele.UserMobile;
          let table = "GT1559AT25.GT1559AT25.GxyUserMember";
          let condition = { UserMobile };
          let billNum = "527acb27";
          let SysUser = ele.SysUser;
          let SysUserCode = ele.SysUserCode;
          let SysyhtUserId = ele.SysyhtUserId;
          let object = {
            SysUser,
            SysUserCode,
            SysyhtUserId
          };
          cb.rest.invokeFunction("GT1559AT25.sync.syncGxyUserOrg", { table, condition, object, billNum }, function (err, res) {
            let index1 = index + 1;
            console.log("第" + index1 + "条");
            console.log(res);
            index++;
            if (index == max) {
              index = 0;
            }
          });
        }, num * 100);
        num++;
      }
    });
  });
viewModel.get("button35ug") &&
  viewModel.get("button35ug").on("click", function (data) {
    // 检查并更新系统用户id--单击
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
    let conditions = "1=1";
    let table = "GT1559AT25.GT1559AT25.GxyUser";
    cb.rest.invokeFunction("GT34544AT7.common.selectSqlApi", { conditions, table }, function (err, res) {
      let ress = res.res;
      let index = 0;
      let num = 0;
      for (let i in ress) {
        let ele = ress[i];
        let phone = ele.UserMobile.substring(4, 15);
        let SysUser = ele.SysUser;
        let SysUserCode = ele.SysUserCode;
        let SysyhtUserId = ele.SysyhtUserId;
        setTimeout(function () {
          getUserinfo(phone).then((info, err) => {
            let uinfo = info.data.content[0];
            if (!!uinfo) {
              let uidx = uinfo.id;
              if (uidx !== SysUser) {
                let table = "GT1559AT25.GT1559AT25.GxyUser";
                let billNum = "3cb28185";
                let object = {
                  id: ele.id,
                  SysUser: JSON.stringify(uidx).replace(/\"/g, "")
                };
                cb.rest.invokeFunction("GT34544AT7.common.updatesql", { table, object, billNum }, function (err, res) {
                  let index1 = index + 1;
                  console.log("第" + index1 + "条数据更改");
                  console.log(res);
                  index++;
                });
              } else {
                console.log("电话: " + phone + "用户正确");
                console.log("uid: " + SysUser);
              }
            } else {
              console.log("电话: " + phone + "未找到用户");
            }
          });
        }, num * 10);
        num++;
      }
    });
  });