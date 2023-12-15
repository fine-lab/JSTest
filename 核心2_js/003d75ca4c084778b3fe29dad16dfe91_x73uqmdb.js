let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var notifyinfo = request;
    var b_appinfo1_id = notifyinfo.b_appinfo1;
    //查询这个应用下所有的租户
    var c_tenant_info_sql =
      "select id,tenantId_mail,tenantId_yhtuserid,tenantId_buy,tenantId_name,tenantId_linkman,be_appinfo_id from " + " GT42337AT12.GT42337AT12.be_tenantIdinfo where be_appinfo_id =" + b_appinfo1_id;
    var tenant_res = ObjectStore.queryByYonQL(c_tenant_info_sql);
    if (tenant_res == undefined || tenant_res.length == 0) throw new Error("该应用下没有查询到租户信息");
    //循环租户信息
    for (let tenantinfo in tenant_res) {
      let mytenantinfo = tenant_res[tenantinfo];
      if (validateEmail(mytenantinfo.tenantId_mail)) {
        //发送邮件
        var mailReceiver = [mytenantinfo.tenantId_mail];
        var channels = ["mail"];
        var messageInfo = {
          sysId: "yourIdHere",
          tenantId: "yourIdHere",
          mailReceiver: mailReceiver,
          channels: channels,
          subject: notifyinfo.b_appinfo1_appname + "自动升级通知",
          content: "升级时间：" + notifyinfo.uptime + "</br>" + notifyinfo.content
        };
        var result = sendMessage(messageInfo);
        var log = {
          y_tenant_id: mytenantinfo.tenantId_buy,
          y_tenant_name: mytenantinfo.tenantId_name,
          receiver: mytenantinfo.tenantId_linkman,
          receiver_mobile: mytenantinfo.tenantId_mail,
          send_result: result,
          be_upnotify_id: notifyinfo.id
        };
        ObjectStore.insert("GT42337AT12.GT42337AT12.maillog", log, "820960d0");
      }
    }
    //更改主表为已发送
    var sendupdate = { id: notifyinfo.id, issend: "2" };
    ObjectStore.updateById("GT42337AT12.GT42337AT12.be_upnotify", sendupdate, "820960d0List");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });