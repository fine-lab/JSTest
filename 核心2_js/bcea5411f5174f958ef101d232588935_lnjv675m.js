let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { app } = request;
    function log(msg) {
      let method = "GT34544AT7.gxsorg.ORegisterGxsOrg";
      let { bizFlowId, bizFlowInstanceId } = request;
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
        nmsg = "\n" + bizFlowInstanceId + ":" + nmsg;
      }
      logfunc.execute({ queen, msg: nmsg });
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
    let { id, sysOrg, OrgCode, name, shortname, sysparent, taxpayerid, taxpayername, principal, branchleader, contact, telephone, address } = app;
    // 如果没有同步
    if (!sysOrg && !!OrgCode) {
      let org = getOrgByCode(OrgCode);
      let norg = {};
      // 如果系统已经有这个组织
      if (Object.keys(org).length > 0) {
        sysOrg = org.id;
        norg = UpOrInsertOrg(sysOrg, "Update", OrgCode, name, sysparent, shortname, taxpayerid, taxpayername, principal, branchleader, contact, telephone, address);
      } else {
        norg = UpOrInsertOrg(null, "Insert", OrgCode, name, sysparent, shortname, taxpayerid, taxpayername, principal, branchleader, contact, telephone, address);
      }
      let P000Code = OrgCode + "_P000";
      let OrgAdminCode = OrgCode + "OrgAdmin";
      let AreaAdminCode = OrgCode + "AreaAdmin";
      let P000Org = searchGxsDept(P000Code);
      let OrgAdminOrg = searchGxsDept(OrgAdminCode);
      let AreaAdminOrg = searchGxsDept(AreaAdminCode);
    }
    // 新增或更新组织
    function UpOrInsertOrg(id, _status, code, name, par, shortname, taxpayerid, taxpayername, principal, branchleader, contact, telephone, address) {
      let request = {};
      let fun2 = extrequire("GT34544AT7.org.orgInsert");
      if (!!_status && !!code && !!name && !!par) {
        request.enable = 1;
        request.orgtype = "1";
        request.code = code;
        request.name = name;
        request.par = par;
        if (!!shortname) {
          request.shortname = shortname;
        }
        if (!!taxpayerid) {
          request.taxpayerid = taxpayerid;
        }
        if (!!taxpayername) {
          request.taxpayername = taxpayername;
        }
        if (!!principal) {
          request.principal = principal;
        }
        if (!!branchleader) {
          request.branchleader = branchleader;
        }
        if (!!contact) {
          request.contact = contact;
        }
        if (!!telephone) {
          request.telephone = telephone;
        }
        if (!!address) {
          request.address = address;
        }
        request._status = _status;
        if (_status === "Update") {
          request.id = id;
        }
        log("开始 " + _status + " 组织 \n" + JSON.stringify(request) + "\n");
        let result2 = fun2.execute(request).res;
        return result2.data;
      } else {
        return {};
      }
    }
    // 查询自建部门并返回
    function searchGxsDept(deptcode) {
      let request = {};
      request.table = "GT34544AT7.GT34544AT7.GxsOrg";
      var searchorg = { OrgCode: deptcode };
      var result5 = ObjectStore.selectByMap(request.table, searchorg);
      if (result5.length == 0) {
        log(deptcode + ":请等待推单流程完成再重新同步");
      } else if (result5.length > 1) {
        log(deptcode + "组织重复,请核对");
      }
      return result5.length == 0 ? {} : result5[0];
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });