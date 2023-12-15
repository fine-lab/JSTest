let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据应用获取租户列表
    var zdytype = request.zdytype;
    var tenant = request.tenant;
    request = request.appinfo;
    var b_appinfo_id = request.id;
    var tenant_res;
    if (zdytype == "list") {
      var c_tenant_info_sql =
        "select id,tenantId_mail,tenantId_yhtuserid,tenantId_buy,tenantId_name,tenantId_linkman,be_appinfo_id from " + " GT42337AT12.GT42337AT12.be_tenantIdinfo where be_appinfo_id =" + b_appinfo_id;
      tenant_res = ObjectStore.queryByYonQL(c_tenant_info_sql);
    } else {
      tenant_res = tenant;
    }
    var all_app_up_res = "";
    //循环租户信息
    if (tenant_res == undefined || tenant_res.length == 0) throw new Error("该应用下没有查询到租户信息");
    for (let tenantinfo in tenant_res) {
      let mytenantinfo = tenant_res[tenantinfo];
      //执行升级逻辑
      var appupreq = {
        tenantId: mytenantinfo.tenantId_buy,
        productId: request.productId
      };
      let appup = extrequire("GT42337AT12.appup.upapi");
      var appupres = appup.execute(appupreq);
      let upapi_result = JSON.parse(appupres.reponse);
      //处理返回结果
      var log = {
        msg: upapi_result.msg,
        status: upapi_result.status,
        json: JSON.stringify(appupres),
        be_tenantIdinfo_id: mytenantinfo.id,
        b_appinfo1: mytenantinfo.be_appinfo_id,
        dr: 0,
        orderId: appupres.request.orderId,
        b_version: request.vno
      };
      var logres = ObjectStore.insert("GT42337AT12.GT42337AT12.be_uplog", log, "0942cfb0");
      var msgdes = upapi_result.status == 1 ? "升级成功" : "升级失败";
      var logmsg = "租户名称：" + mytenantinfo.tenantId_name + "；租户ID：" + mytenantinfo.tenantId_buy + "；结果：" + msgdes + "；<br/>";
      all_app_up_res += logmsg;
      //更新应用版本号
      var app_version = { id: request.id, new_version: request.vno };
      ObjectStore.updateById("GT42337AT12.GT42337AT12.be_appinfo", app_version, "0942cfb0");
    }
    if (all_app_up_res.length > 0) {
      //执行升级结果通知
      let sendnotify = extrequire("GT42337AT12.appup.sendnotifymanager");
      var notifybody = {
        tenantId: "yourIdHere", //写死用友云生态
        receiver: [request.linkman_yhtuserid],
        appname: request.appname,
        content: all_app_up_res
      };
      var notifyres = sendnotify.execute(notifybody);
    }
    return { res: notifyres };
  }
}
exports({ entryPoint: MyAPIHandler });