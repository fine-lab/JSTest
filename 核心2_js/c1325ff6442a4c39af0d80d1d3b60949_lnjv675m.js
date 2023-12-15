let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function logs(msg) {
      let method = "test.test";
      let { bizFlowId, bizFlowInstanceId } = param.return;
      let queen = "";
      if (!!bizFlowId && !!bizFlowInstanceId) {
        queen += bizFlowId;
      } else {
        queen += "hellword";
      }
      let msg1 = "";
      let type = typeof msg;
      if (type == "string") {
        msg1 = msg;
      } else {
        msg1 = JSON.stringify(msg);
      }
      let nmsg = "\n" + method + "\n" + msg1;
      let logfunc = extrequire("GT9912AT31.common.logQueen");
      if (!!bizFlowInstanceId) {
        nmsg = "\n" + bizFlowInstanceId + ":\n" + nmsg;
      }
      logfunc.execute({ queen, msg: nmsg });
    }
    // 带更新用户主子孙数据
    let changeobjs = {};
    var app = param.return;
    var GxyUserOrgList = app.GxyUserOrgList;
    var changeids = [];
    var gxyUser = app.id;
    var sqlUser = "select id,SysyhtUserId,UserMobile,SysUser,SysUserCode from GT1559AT25.GT1559AT25.GxyUser where id = '" + gxyUser + "'";
    var resUser = ObjectStore.queryByYonQL(sqlUser);
    var gxyuser = resUser[0];
    logs("进入 GT1559AT25.staff.UpGxsStaffBind \nreturn=" + JSON.stringify(app) + "\n");
    logs("gxyuser=" + JSON.stringify(gxyuser));
    logs("GxyUserOrgList=" + JSON.stringify(GxyUserOrgList));
    changeobjs.id = gxyuser.id;
    let { SysyhtUserId, SysUser, SysUserCode } = app;
    if (!!SysyhtUserId && !!SysUser && !!SysUserCode) {
    } else {
      logs("主表未同步完全\n" + JSON.stringify(gxyuser));
    }
    logs("GT1559AT25.staff.UpGxsStaffBind:\n" + "param.action=>" + param.action + "\n" + "param.billnum=>" + param.billnum + "\n" + sqlUser + "\n" + JSON.stringify(resUser) + "\n");
    if (!!GxyUserOrgList && (Object.keys(GxyUserOrgList).length > 0 || GxyUserOrgList.length > 0)) {
      changeobjs.GxyUserOrgList = [];
      for (var i = 0; i < GxyUserOrgList.length; i++) {
        var GxyUserOrg = GxyUserOrgList[i];
        logs("GxyUserOrg=\n" + JSON.stringify(GxyUserOrg));
        var gxyUserOrg = GxyUserOrg.id;
        if (!SysyhtUserId || !GxyUserOrg.SysUser || !GxyUserOrg.SysUserCode) {
          if (!!SysyhtUserId && !!SysUser && !!SysUserCode) {
            changeobjs.GxyUserOrgList.push({ id: gxyUserOrg, SysyhtUserId, SysUser, SysUserCode, _status: "Update" });
          }
        }
        if (!!SysyhtUserId) {
          let req = {
            gxyUserID: gxyUser,
            gxyUserOrg,
            SysyhtUserId,
            SysUser: "" + gxyuser.SysUser,
            SysUserCode: gxyuser.SysUserCode,
            mobile: gxyuser.UserMobile
          };
          log.execute({ msg: "req=" + JSON.stringify(req) });
          let funcWritebackSysUser = extrequire("GT9912AT31.auth.WritebackSysUser");
          let resWritebackSysUser = funcWritebackSysUser.execute(req).res;
          log.execute({ msg: "resWritebackSysUser" + JSON.stringify(resWritebackSysUser) });
        } else {
          logs("找不到 SysyhtUserId");
        }
        let gusjnl = GxyUserOrg.GxyUserStaffJobNewList;
        if (gusjnl !== undefined && !!gusjnl.length && (Object.keys(gusjnl).length > 0 || gusjnl.length > 0)) {
          console.log("进入条件");
          if (!!SysyhtUserId && !!SysUser && !!SysUserCode) {
            changeobjs.GxyUserOrgList[i].GxyUserStaffJobNewList = [];
          }
          var size = parseInt(gusjnl.length);
          logs("gusjnl == \n" + JSON.stringify(gusjnl) + "\nlen=" + size);
          for (var j = 0; j < size; j++) {
            var GxyUserStaffJobNew = gusjnl[j];
            if (!GxyUserStaffJobNew.SysyhtUserId || !GxyUserStaffJobNew.SysUser || !GxyUserStaffJobNew.SysUserCode) {
              if (!!SysyhtUserId && !!SysUser && !!SysUserCode) {
                changeobjs.GxyUserOrgList[i].GxyUserStaffJobNewList.push({
                  id: GxyUserStaffJobNew.id,
                  SysyhtUserId,
                  SysUser,
                  SysUserCode,
                  _status: "Update"
                });
              }
            }
            var GxyStaffid = GxyUserStaffJobNew.GxyStaffid;
            var SysDept = GxyUserStaffJobNew.SysDept;
            let apiget = extrequire("GT34544AT7.common.baseOpenApiGet");
            var req1 = {
              uri: "/yonbip/digitalModel/admindept/detail",
              parm: { id: SysDept }
            };
            let deptdeal = apiget.execute(req1).res;
            var sysDeptCode = deptdeal.data.code;
            var obj = {
              GxyStaffid,
              gxyUserOrg,
              sysDeptCode,
              SysDept
            };
            changeids.push(obj);
          }
        } else {
          logs("找不到 GxyUserStaffJobNewList");
        }
      }
      // 更新主子孙
      if (!!changeobjs.GxyUserOrgList && changeobjs.GxyUserOrgList.length > 0) {
        logs("待更新用户信息 == \n" + JSON.stringify(changeobjs));
        var upgxyuser = ObjectStore.updateById("GT1559AT25.GT1559AT25.GxyUser", changeobjs, "70e55554");
        logs("更新后返回 == \n" + JSON.stringify(upgxyuser));
      }
      var res = [];
      var csize = changeids.length;
      logs("changeids == \n" + JSON.stringify(changeids) + "\nlen=" + csize);
      if (csize > 0) {
        var objs = [];
        for (var i in changeids) {
          var obj = changeids[i];
          var id = obj.GxyStaffid;
          var gxyUserOrg = obj.gxyUserOrg;
          var opbj = { isuser: "1", id, gxyUser, gxyUserOrg };
          if (!!SysyhtUserId) {
            logs("找到uuid => " + SysyhtUserId);
            opbj.sysUserid = SysyhtUserId;
            var sysDeptCode = obj.sysDeptCode;
            var SysDept = obj.SysDept;
            if (!!sysDeptCode && !!SysDept && sysDeptCode.indexOf("AreaAdmin") > -1) {
              logs("找到区域管理 => " + sysDeptCode);
              var sqlArea = "select id from GT34544AT7.GT34544AT7.gxsAreaAdmin where GxsStaffFk='" + id + "' " + "and AdminOrgVO='" + SysDept + "' and StaffNewSysyhtUserId is null";
              var resArea = ObjectStore.queryByYonQL(sqlArea);
              if (resArea.length > 0) {
                var areaid = resArea[0].id;
                opbj.gxsAreaAdminList = [{ id: areaid, sysDeptCode, _status: "Update" }];
                opbj.gxsAreaAdminList[0].StaffNewSysyhtUserId = SysyhtUserId;
              }
            } else if (sysDeptCode.indexOf("OrgAdmin") > -1) {
              logs("找到组织管理 => " + sysDeptCode);
              var sqlOrg = "select id from GT34544AT7.GT34544AT7.gxsOrgAdmin where GxsStaffFk='" + id + "' " + "and AdminOrgVO='" + SysDept + "' and StaffNewSysyhtUserId is null";
              var resOrg = ObjectStore.queryByYonQL(sqlOrg);
              if (resOrg.length > 0) {
                var orgid = resOrg[0].id;
                opbj.gxsOrgAdminList = [{ id: orgid, sysDeptCode, _status: "Update" }];
                opbj.gxsOrgAdminList[0].StaffNewSysyhtUserId = SysyhtUserId;
                opbj.gxsOrgAdminList[0].SysyhtUserId = SysyhtUserId;
                opbj.gxsOrgAdminList[0].SysUser = SysUser;
                opbj.gxsOrgAdminList[0].SysUserCode = SysUserCode;
              }
            } else {
              logs("只找到uuid，区域，组织什么都没有找到 => " + sysDeptCode);
            }
          } else {
            logs("没有找到uuid => \n" + JSON.stringify(obj) + "\n");
          }
          // 判断是区域管理员兼职还是组织管理员兼职
          objs.push(opbj);
        }
        logs("最后数据新增数据 => \n" + JSON.stringify(objs) + "\n");
        let res = ObjectStore.updateBatch("GT34544AT7.GT34544AT7.GxsStaff", objs, "ybfe5079ea");
        logs("UpGxsStaffBind返回 ==> " + JSON.stringify(res) + "\n");
      } else {
        logs("没找到需要更新的数据");
      }
    } else {
      logs("没有GxyUserOrgList或者len为0");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });