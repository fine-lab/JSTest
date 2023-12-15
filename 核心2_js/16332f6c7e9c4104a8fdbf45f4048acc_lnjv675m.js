let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function log(msg) {
      let method = "GT34544AT7.gxsorg.registerGxsOrg";
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
    let napp = param.data[0];
    let sys_status = napp._status;
    if (sys_status == null) {
      let action = param.action;
      if (action == "audit") {
        sys_status = "Update";
      }
    }
    var apporg = { id: napp.id };
    var gxsorgs = ObjectStore.selectByMap("GT34544AT7.GT34544AT7.GxsOrg", apporg);
    let status = 0;
    var app = {};
    if (gxsorgs.length > 0) {
      status = 1;
      app = gxsorgs[0];
    } else {
      throw new Error("未知错误");
    }
    let sysorgstatus = !!app.sysOrg ? "Update" : "Insert";
    log("第一次设置 sysorgstatus = " + sysorgstatus);
    let _status = null;
    if (status == 0) {
      _status = "Insert";
    } else if (status == 1) {
      _status = "Update";
    }
    var logs = [];
    log("返回 _status = " + _status);
    // 上级节点是否存在
    var mysysparent = getOrgByCode(app.sysparentcode);
    if (!!mysysparent) {
      param.data[0].set("sysparent", mysysparent.id);
    } else {
      throw new Error("没有所属单元不可操作");
    }
    // 本级节点是否存在
    var mysysorg = getOrgByCode(app.OrgCode);
    if (!!mysysorg) sysorgstatus = Object.keys(mysysorg).length > 0 ? "Update" : "Insert";
    var codes = app.sysparentcode + "\n" + app.OrgCode;
    let request = {};
    let fun2 = extrequire("GT34544AT7.org.orgInsert");
    request.enable = 1;
    request.code = app.OrgCode;
    request.name = app.name;
    request.shortname = app.shortname;
    request.par = mysysparent.id;
    request.orgtype = "1";
    if (!!app.taxpayerid) {
      request.taxpayerid = app.taxpayerid;
    }
    if (!!app.taxpayername) {
      request.taxpayername = app.taxpayername;
    }
    if (!!app.principal) {
      request.principal = app.principal;
    }
    if (!!app.branchleader) {
      request.branchleader = app.branchleader;
    } else {
      request.branchleader = app.principal;
    }
    request.contact = app.contact;
    request.telephone = app.telephone;
    request.address = app.address;
    request._status = sysorgstatus;
    if (sysorgstatus === "Update") {
      request.id = mysysorg.id;
    }
    log("开始 " + sysorgstatus + " 组织 \n" + JSON.stringify(request) + "\n");
    let result2 = fun2.execute(request).res;
    if (result2.code === "999") {
      log(sysorgstatus + " 组织 错误 \n" + JSON.stringify(result2) + "\n");
      result2.data = getOrgByCode(app.OrgCode);
    }
    log(sysorgstatus + " 组织 返回 \n" + JSON.stringify(result2) + "\n");
    if (_status == "Update" && !app.sysOrg) {
      let nnorg = {
        id: app.id,
        sysOrg: result2.data.id,
        sysOrgCode: result2.data.code
      };
      log("更新时发现没有同步 开始 同步 \n" + JSON.stringify(nnorg) + "\n");
      request.table = "GT34544AT7.GT34544AT7.GxsOrg";
      request.object = nnorg;
      request.billNum = "yb0affed4b";
      let upfunc7 = extrequire("GT34544AT7.common.updatesql");
      let result7 = upfunc7.execute(request);
      log("修改更新gxsOrg 同步SysOrg 返回" + JSON.stringify(result7));
    }
    app.sysOrg = result2.data.id;
    app.sysOrgCode = result2.data.code;
    if (_status == "Insert") {
      let norg = napp;
      norg.id = app.id;
      norg.sysOrg = app.sysOrg;
      norg.sysOrgCode = app.sysOrgCode;
      norg.sysparentorg = app.parentorgid;
      norg.sysparent = accorg.parentorgid;
      norg.sysparentcode = accorg.parentorgCode;
      // 更新gxsOrg
      request.table = "GT34544AT7.GT34544AT7.GxsOrg";
      request.object = norg;
      request.billNum = "yb0affed4b";
      let func7 = extrequire("GT34544AT7.common.updatesql");
      let result7 = func7.execute(request);
      log("第一次新增gxsOrg 同步SysOrg 返回" + JSON.stringify(result7));
    }
    var p000code = app.OrgCode + "_P000";
    // 查找gxsOrg的P000部门
    request.table = "GT34544AT7.GT34544AT7.GxsOrg";
    var P000org = { OrgCode: p000code };
    var result5 = ObjectStore.selectByMap(request.table, P000org);
    if (result5.length == 0) {
      throw new Error(p000code + ":请等待推单流程完成再重新同步");
    } else if (result5.length > 1) {
      throw new Error(p000code + "组织重复,请核对");
    }
    log("查询到 " + p000code + " 部门: \n" + JSON.stringify(result5) + "\n");
    var orgAdmincode = app.OrgCode + "OrgAdmin";
    var OrgAdminorg = {
      OrgCode: orgAdmincode
    };
    let func6 = ObjectStore.selectByMap(request.table, OrgAdminorg);
    if (func6.length == 0) {
      throw new Error(orgAdmincode + ":请等待推单流程完成再重新同步");
    } else if (func6.length > 1) {
      throw new Error(orgAdmincode + "组织重复,请核对");
    }
    log("查询到 " + orgAdmincode + " 部门: \n" + JSON.stringify(func6) + "\n");
    var areaCode = app.OrgCode + "AreaAdmin";
    var AreaAdminorg = { OrgCode: areaCode };
    // 查找gxsOrg的AreaAdmin部门
    let func16 = ObjectStore.selectByMap(request.table, AreaAdminorg);
    if (func16.length == 0) {
      throw new Error(areaCode + ":请等待推单流程完成再重新同步");
    } else if (func16.length > 1) {
      throw new Error(areaCode + "组织重复,请核对");
    }
    log("查询到 " + areaCode + " 部门: \n" + JSON.stringify(func16) + "\n");
    // 第一次新增才更新同步
    // 新增sysOrg的P000部门（dept）
    let deptInsert = extrequire("GT34544AT7.dept.deptInsert");
    let url = "https://www.example.com/";
    request.enable = 1;
    request.define3 = "0";
    request.code = app.OrgCode + "_P000";
    request.name = app.name + "默认部门";
    request.shortname = app.shortname;
    request.par = result2.data.id;
    request._status = "Insert";
    let body3 = {
      data: {
        code: [request.code]
      }
    };
    let apiResponse3 = openLinker("POST", url, "GT53685AT3", JSON.stringify(body3));
    let r3 = JSON.parse(apiResponse3);
    log("查询 " + request.code + " 系统部门返回r3: \n" + JSON.stringify(r3) + "\n");
    let result3 = {};
    if (r3.data.length > 0) {
      result3.data = r3.data[0];
    } else {
      log("新增" + request.code + "系统部门\n");
      result3 = deptInsert.execute(request).res;
    }
    let id1 = !!result3.data ? result3.data.id : result3.id;
    if (result5.length > 0) {
      let norg = result5[0];
      let nnorg = {
        id: norg.id,
        enable: 1,
        sysOrg: id1,
        sysOrgCode: request.code,
        sysparentorg: result2.data.id,
        sysparent: result2.data.id,
        sysparentcode: app.sysOrgCode,
        _status: "update"
      };
      if (!!app.principal) {
        nnorg.principal = app.principal;
      }
      if (!!app.branchleader) {
        nnorg.branchleader = app.branchleader;
      }
      // 更新gxsOrg的P000部门
      let func7 = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", nnorg, "f25b5dba");
      log("更新 " + request.code + " Gxs部门返回func7: \n" + JSON.stringify(func7) + "\n");
    }
    // 新增sysOrg的OrgAdmin部门（dept）
    request.code = app.OrgCode + "OrgAdmin";
    request.enable = 1;
    request.define3 = "1";
    request.name = app.name + "管理部门";
    request.shortname = app.shortname;
    request.par = result2.data.id;
    request._status = "Insert";
    let result4 = {};
    let body4 = {
      data: {
        code: [request.code]
      }
    };
    let apiResponse4 = openLinker("POST", url, "GT53685AT3", JSON.stringify(body4));
    let r4 = JSON.parse(apiResponse4);
    log("查询 " + request.code + " 系统部门返回r4: \n" + JSON.stringify(r4) + "\n");
    if (r4.data.length > 0) {
      result4.data = r3.data[0];
    } else {
      log("新增" + request.code + "系统部门\n");
      result4 = deptInsert.execute(request).res;
    }
    let id2 = !!result4.data ? result4.data.id : result4.id;
    if (func6.length > 0) {
      let norg1 = func6[0];
      let nnorg = {
        id: norg1.id,
        enable: 1,
        sysOrg: id2,
        sysOrgCode: request.code,
        sysparentorg: result2.data.id,
        sysparent: result2.data.id,
        sysparentcode: app.sysOrgCode
      };
      if (!!app.principal) {
        nnorg.principal = app.principal;
      }
      if (!!app.branchleader) {
        nnorg.branchleader = app.branchleader;
      }
      // 更新gxsOrg的OrgAdmin部门
      let result8 = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", nnorg, "f25b5dba");
      log("更新 " + request.code + " Gxs部门返回result8: \n" + JSON.stringify(result8) + "\n");
    }
    // 新增sysOrg的OrgAdmin部门（dept）
    request.code = app.OrgCode + "AreaAdmin";
    request.name = app.name + "区域管理部门";
    request.enable = 1;
    request.define3 = "1";
    request.shortname = app.shortname;
    request.par = result2.data.id;
    request._status = "Insert";
    let result9 = {};
    let body9 = {
      data: {
        code: [request.code]
      }
    };
    let apiResponse9 = openLinker("POST", url, "GT53685AT3", JSON.stringify(body9));
    let r9 = JSON.parse(apiResponse9);
    log("查询 " + request.code + " 系统部门返回r9: \n" + JSON.stringify(r9) + "\n");
    if (r9.data.length > 0) {
      result9.data = r9.data[0];
    } else {
      log("新增" + request.code + "系统部门\n");
      result9 = deptInsert.execute(request).res;
    }
    let id3 = !!result9.data ? result9.data.id : result9.id;
    // 查找gxsOrg的AreaAdmin部门
    if (func16.length > 0) {
      let norg2 = func16[0];
      let nnorg = {
        id: norg2.id,
        sysOrg: id3,
        enable: 1,
        sysOrgCode: request.code,
        sysparentorg: result2.data.id,
        sysparent: result2.data.id,
        sysparentcode: app.sysOrgCode
      };
      if (!!app.principal) {
        nnorg.principal = app.principal;
      }
      if (!!app.branchleader) {
        nnorg.branchleader = app.branchleader;
      }
      // 更新gxsOrg的OrgAdmin部门
      let res9 = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", nnorg, "f25b5dba");
      log("更新 " + request.code + " Gxs部门返回res9: \n" + JSON.stringify(res9) + "\n");
    }
    function getOrgByCode(code) {
      if (!!code) {
        var body = { code };
        let funcgetf = extrequire("GT34544AT7.org.searchOrgByCode");
        let resgetf = funcgetf.execute(body);
        var objs = resgetf.res.data;
        var myobj1 = {};
        for (var i in objs) {
          var myobj = objs[i];
          var objcus = searchchildren(myobj, code);
          if (Object.keys(objcus).length > 0) {
            myobj1 = objcus;
          }
        }
        function searchchildren(obj, code) {
          if (obj.code == code) {
            return obj;
          } else {
            if (!!obj.children) {
              var childrens = obj.children;
              var nchilds = [];
              for (var j = 0; j < childrens.length; j++) {
                let child = childrens[j];
                var nobj1 = searchchildren(child, code);
                nchilds.push(nobj1);
              }
              var racc = {};
              for (var j = 0; j < nchilds.length; j++) {
                var nchild = nchilds[j];
                if (Object.keys(nchild).length > 0) {
                  racc = nchild;
                  break;
                }
              }
              if (Object.keys(racc).length > 0) {
                return racc;
              } else {
                return {};
              }
            } else {
              return {};
            }
          }
        }
        return myobj1;
      } else return null;
    }
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });