let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let token = ObjectStore.env().token;
    var resp = JSON.parse(JSON.stringify(param));
    var obj = JSON.parse(resp.requestData);
    var object = { id: obj[0].id };
    var res = ObjectStore.selectByMap("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", object);
    var verifystate = res[0].verifystate;
    var escid = res[0].escid;
    var person = res[0].esc_applicantName;
    var domainCloud = res[0].esc_domainCloud;
    var domain = res[0].escDomain;
    var appName = res[0].esc_appServiceName;
    var appCode = res[0].esc_appServiceCode;
    var email = res[0].esc_applicantEmail;
    var microServiceCode = res[0].esc_microServiceCode;
    if (microServiceCode == undefined) {
      microServiceCode = "无";
    }
    let body = { verifystate: verifystate, escid: escid, token: token };
    let header = {};
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    var text =
      "尊敬的" +
      person +
      "，您好： " +
      "您在YonBIP申请的 " +
      appName +
      "，" +
      appCode +
      " 已审批通过，详细信息请登录客户端（申请租户：应用编码申请列表）查看。审批通过的应用编码是：" +
      appCode +
      "；微服务编码是：" +
      microServiceCode +
      ";应用编码和微服务编码的使用要求及规范：YonBuilder下构建应用的应用编码需要使用：分配的应用编码；后端服务的引擎编码需要使用：分配的微服务编码；注意：如不按规范使用，构建的应用不会被制品库识别。对应用编码和微服务编码有疑问，到YonBIP开发者社区咨询（https://community.yonyou.com/forum-80-1.html）祝：工作顺心！用友集团YonBIP应用架构部";
    // 收件人邮箱
    var mailReceiver = [email];
    // 消息通道
    var channels = ["mail"];
    // 信息封装
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "YonBIP应用编码及微服务编码申请审批通知",
      content: text
    };
    var result = sendMessage(messageInfo);
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });