let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let napp = param.data[0];
    let maintable = "GT9912AT31.GT9912AT31.CloudCustomer";
    if (napp.verifystate == 2) {
      var apporg = { id: napp.id };
      var gxsorgs = ObjectStore.selectByMap(maintable, apporg);
      let status = 0;
      var app = {};
      if (gxsorgs.length > 0) {
        status = 1;
        app = gxsorgs[0];
      } else {
        throw new Error("未知错误");
      }
      let _status = null;
      if (status == 0) {
        _status = "Insert";
      } else if (status == 1) {
        _status = "Update";
      }
      var logs = [];
      function getOrgByCode(code) {
        if (!!code) {
          var body = { code };
          logs.push(JSON.stringify(body));
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
            logs.push("searchchildren ==>");
            if (obj.code == code) {
              logs.push(JSON.stringify(obj) + "\n");
              return obj;
            } else {
              if (!!obj.children) {
                var childrens = obj.children;
                var nchilds = [];
                for (var j = 0; j < childrens.length; j++) {
                  let child = childrens[j];
                  logs.push(child.code + "==>");
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
      var log = "";
      for (let i in logs) {
        log += logs[i] + "\n";
      }
      // 上级节点是否存在
      var mysysparent = getOrgByCode(app.sysparentcode);
      if (!!mysysparent) {
      } else {
        throw new Error("没有所属单元不可操作");
      }
      // 本级节点是否存在
      var sysorgstatus = "Insert";
      var mysysorg = getOrgByCode(app.OrgCode);
      if (!!mysysorg) sysorgstatus = Object.keys(mysysorg).length > 0 ? "Update" : "Insert";
      var codes = app.sysparentcode + "\n" + app.OrgCode;
      let request = {};
      let fun2 = extrequire("GT34544AT7.org.orgInsert");
      request.enable = napp.enable;
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
      let result2 = fun2.execute(request).res;
      if (result2.code === "999") {
        result2.data = getOrgByCode(app.OrgCode);
      }
      app.sysOrg = result2.data.id;
      app.sysOrgCode = result2.data.code;
      var p000code = app.OrgCode + "_P000";
      // 查找gxsOrg的P000部门
      request.table = maintable;
      var P000org = { OrgCode: p000code };
      var result5 = ObjectStore.selectByMap(request.table, P000org);
      if (result5.length == 0) {
        throw new Error(p000code + ":请等待推单流程完成再重新同步");
      }
      var orgAdmincode = app.OrgCode + "OrgAdmin";
      var OrgAdminorg = {
        OrgCode: orgAdmincode
      };
      let func6 = ObjectStore.selectByMap(request.table, OrgAdminorg);
      if (func6.length == 0) {
        throw new Error(orgAdmincode + ":请等待推单流程完成再重新同步");
      }
      var areaCode = app.OrgCode + "AreaAdmin";
      var AreaAdminorg = { OrgCode: areaCode };
      // 查找gxsOrg的AreaAdmin部门
      let func16 = ObjectStore.selectByMap(request.table, AreaAdminorg);
      if (func16.length == 0) {
        throw new Error(areaCode + ":请等待推单流程完成再重新同步");
      }
      let gxsinsert = ObjectStore.updateById(
        maintable,
        {
          id: app.id,
          sysOrg: app.sysOrg,
          sysOrgCode: app.sysOrgCode
        },
        "f25b5dba"
      );
      let sysgxsorg = gxsinsert;
      // 新增sysOrg的P000部门（dept）
      let fun3 = extrequire("GT34544AT7.dept.deptInsert");
      request.define3 = "0";
      request.enable = napp.enable;
      request.code = app.OrgCode + "_P000";
      request.name = app.name + "默认部门";
      request.shortname = app.shortname;
      request.par = result2.data.id;
      request._status = "Insert";
      let result3 = fun3.execute(request).res;
      if (result3.code === "999") {
        let url = "https://www.example.com/";
        let body = {
          data: {
            code: [request.code]
          }
        };
        let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
        let r3 = JSON.parse(apiResponse);
        result3.data = r3.data[0];
      }
      let id1 = result3.data.id;
      if (result5.length > 0) {
        let norg = result5[0];
        let nnorg = {
          id: norg.id,
          sysOrg: id1,
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
        // 更新gxsOrg的P000部门
        let func7 = ObjectStore.updateById(maintable, nnorg, "f25b5dba");
      }
      // 新增sysOrg的OrgAdmin部门（dept）
      let fun4 = extrequire("GT34544AT7.dept.deptInsert");
      request.code = app.OrgCode + "OrgAdmin";
      request.enable = napp.enable;
      request.define3 = "1";
      request.name = app.name + "管理部门";
      request.shortname = app.shortname;
      request.par = result2.data.id;
      request._status = "Insert";
      let result4 = fun4.execute(request).res;
      if (result4.code === "999") {
        let url = "https://www.example.com/";
        let body = {
          data: {
            code: [request.code]
          }
        };
        let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
        let r4 = JSON.parse(apiResponse);
        result4.data = r4.data[0];
      }
      let id2 = result4.data.id;
      if (func6.length > 0) {
        let norg1 = func6[0];
        let nnorg = {
          id: norg1.id,
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
        let result8 = ObjectStore.updateById(maintable, nnorg, "f25b5dba");
      }
      // 新增sysOrg的OrgAdmin部门（dept）
      let fun9 = extrequire("GT34544AT7.dept.deptInsert");
      request.code = app.OrgCode + "AreaAdmin";
      request.name = app.name + "区域管理部门";
      request.define3 = "1";
      request.enable = napp.enable;
      request.shortname = app.shortname;
      request.par = result2.data.id;
      request._status = "Insert";
      let result9 = fun9.execute(request).res;
      if (result9.code === "999") {
        let url = "https://www.example.com/";
        let body = {
          data: {
            code: [request.code]
          }
        };
        let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body));
        let r4 = JSON.parse(apiResponse);
        result9.data = r4.data[0];
      }
      let id3 = result9.data.id;
      // 查找gxsOrg的AreaAdmin部门
      let func161 = ObjectStore.selectByMap(maintable, {
        OrgCode: request.code
      });
      if (func161.length > 0) {
        let norg2 = func161[0];
        let nnorg = {
          id: norg2.id,
          sysOrg: id3,
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
        ObjectStore.updateById(maintable, nnorg, "f25b5dba");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });