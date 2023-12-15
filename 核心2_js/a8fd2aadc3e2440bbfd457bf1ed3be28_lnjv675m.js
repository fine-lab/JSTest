let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let app = JSON.parse(param.requestData);
    let enable = param.active == "stop" ? 0 : 1;
    function log(msg) {
      let method = "GT1559AT25.org.registerGxyCus";
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
    function getOrgByCode(code) {
      if (!!code) {
        var body = { code };
        log("查询输入 \n" + JSON.stringify(body));
        let funcgetf = extrequire("GT34544AT7.org.searchOrgByCode");
        let resgetf = funcgetf.execute(body);
        log("查询返回获取1 \n" + JSON.stringify(resgetf));
        var objs = resgetf.res.data;
        log("查询返回获取2 \n" + JSON.stringify(objs));
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
    log("开始 registerGxyCus");
    log("app 返回 " + JSON.stringify(app));
    if (enable !== "stop") {
      log("这是 " + enable + " 状态");
      var codes = [];
      var logs = [];
      var parientobj = getOrgByCode(app.sysparentcode);
      if (parientobj != null) {
        log("找到上级\n" + JSON.stringify(parientobj));
      } else {
        throw new Error("未找到上级。");
      }
      let servicecode = "agent";
      // 用户鉴权
      let authusertable = "GT1559AT25.GT1559AT25.CusAppService_User";
      // 组织鉴权
      let authtable = "GT1559AT25.GT1559AT25.CusAppService_Org";
      let table = "GT1559AT25.GT1559AT25.GxyCustomer";
      let depttable = "GT1559AT25.GT1559AT25.GxyCustomerDept";
      let billNo = "fb9f263e";
      var apporg = { OrgCode: app.OrgCode };
      var gxsorgs = ObjectStore.selectByMap(table, apporg);
      var gxsorg = gxsorgs[0];
      log("gxsorg 客户信息\n" + JSON.stringify(gxsorg));
      if (!!parientobj) {
        app.sysparent = parientobj.id;
      } else {
        app.sysparent = gxsorg.sysparent;
      }
      let status = !!gxsorg.sysOrg ? 1 : 0;
      let _status = null;
      if (status == 0) {
        _status = "Insert";
      } else if (status == 1) {
        _status = "Update";
      }
      log("当前是 " + _status + " 状态");
      let request = {};
      let fun2 = extrequire("GT34544AT7.org.orgInsert");
      request.enableAdminOrg = 1;
      request.enable = enable;
      request.code = app.OrgCode;
      request.name = app.name;
      request.shortname = app.shortname;
      request.par = app.sysparent;
      request.orgtype = "1";
      request._status = _status;
      if (_status === "Update") {
        request.id = app.sysOrg;
      }
      let result2 = fun2.execute(request).res;
      if (result2.code === "999") {
        result2.data = getOrgByCode(app.OrgCode);
      }
      app.sysOrg = result2.data.id;
      app.OrgCode = result2.data.code;
      let gxsinsert = ObjectStore.updateById(
        table,
        {
          id: app.id,
          org_id: app.sysOrg,
          sysOrg: app.sysOrg,
          OrgCode: app.OrgCode
        },
        "a8dfbfba"
      );
      let sysgxsorg = gxsinsert;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });