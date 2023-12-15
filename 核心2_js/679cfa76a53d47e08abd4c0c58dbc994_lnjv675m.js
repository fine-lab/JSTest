let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function log(msg) {
      console.log(msg);
    }
    let napp = param.data[0];
    if (napp.verifystate == 2) {
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
      log("搜索到app \n" + app);
      let _status = null;
      if (status == 0) {
        _status = "Insert";
      } else if (status == 1) {
        _status = "Update";
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
      // 上级节点是否存在
      var mysysparent = getOrgByCode(app.sysparentcode);
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
      log("新增组织\n" + JSON.stringify(result2.data));
      if (sysorgstatus == "Update" && !app.sysOrg) {
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
      let deptInsert = extrequire("GT34544AT7.dept.deptInsert");
      let url = "https://www.example.com/";
      request.define3 = "0";
      request.enable = napp.enable;
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
      let result3 = {};
      let tag3 = "";
      if (r3.data.length > 0) {
        result3.data = r3.data[0];
        tag3 = "存在";
      } else {
        tag3 = "新增";
        result3 = deptInsert.execute(request).res;
      }
      let id1 = !!result3.data ? result3.data.id : result3.id;
      let orgdeptp000 = !!result3.data ? result3.data : result3;
      log(tag3 + request.code + "\n" + JSON.stringify(orgdeptp000) + "\n");
      // 新增sysOrg的OrgAdmin部门（dept）
      request.code = app.OrgCode + "OrgAdmin";
      request.enable = napp.enable;
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
      let tag4 = "";
      if (r4.data.length > 0) {
        result4.data = r3.data[0];
        let tag4 = "存在";
      } else {
        result4 = deptInsert.execute(request).res;
        let tag4 = "新增";
      }
      let id2 = !!result4.data ? result4.data.id : result4.id;
      let orgdeptOrgAdmin = !!result4.data ? result4.data : result4;
      log(tag4 + request.code + "\n" + JSON.stringify(orgdeptOrgAdmin) + "\n");
      // 新增sysOrg的OrgAdmin部门（dept）
      request.code = app.OrgCode + "AreaAdmin";
      request.name = app.name + "区域管理部门";
      request.define3 = "1";
      request.enable = napp.enable;
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
      let tag9 = "";
      if (r9.data.length > 0) {
        result9.data = r9.data[0];
        tag9 = "存在";
      } else {
        result9 = deptInsert.execute(request).res;
        tag9 = "新增";
      }
      let id3 = !!result9.data ? result9.data.id : result9.id;
      let orgdeptAreaAdmin = !!result9.data ? result9.data : result9;
      log(tag9 + request.code + "\n" + JSON.stringify(orgdeptAreaAdmin) + "\n");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });