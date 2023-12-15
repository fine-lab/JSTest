let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var email = request.email;
    var id = request.id;
    var code = request.code;
    var yhtUserId = request.yhtUserid;
    var sourceOrgName = request.sourceOrgName;
    var partnerId = request.org_id;
    var sendResult = {};
    function sendMailMessage(mailReceiver, emailContent) {
      // 验证结果：result: "{\"msg\":\"消息发送成功\",\"msgList\":[{\"responseStatusCode\":\"1\",\"receiver\":\"linjiec@yonyou.com\",\"responseContent\":\"向linjiec@yonyou.com发送邮件成功\"}],\"status\":1}"
      var mailChannels = ["mail"];
      var mailMessageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        mailReceiver: mailReceiver,
        channels: ["mail"],
        subject: "外包资源预提单（伙伴回执）",
        content: emailContent
      };
      var result = sendMessage(mailMessageInfo);
    }
    function sendDBMessage(userReceiver, content, webUrl, mUrl) {
      //结果：{"msg":"消息发送成功","msgList":[{"responseStatusCode":"…-6c48-43b7-8ba7-62a47a767034创建代办成功"}],"status":1}
      var content = emailContent;
      var createToDoExt = {
        webUrl: webUrl,
        mUrl: mUrl
      };
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        receiver: userReceiver,
        channels: ["uspace"],
        subject: "外包资源预提单（伙伴回执）",
        content: content,
        messageType: "createToDo",
        createToDoExt: createToDoExt
      };
      var result = sendMessage(messageInfo);
    }
    //消息模板测试
    var emailContent =
      "<p>外包资源预提单（伙伴回执）</p><p>您有一个外包资源预提单（伙伴回执）待响应。</p><p>反馈单号：" +
      code +
      "</p><p>经营机构：" +
      sourceOrgName +
      '</p><p>单据地址：<a href="https://www.example.com/' +
      id +
      '?domainKey=developplatform&amp;apptype=mdf&amp;tenantId=n7ikv2mf" target="_blank">点击此处打开单据</a></p>';
    var webUrl = "https://www.example.com/" + id + "?domainKey=developplatform&apptype=mdf&tenantId=n7ikv2mf";
    var mUrl =
      "https://www.example.com/" +
      id +
      "&readOnly=true&terminalType=3&tenantId=n7ikv2mf&from_mc_workflow=1";
    var mailReceiver = [];
    mailReceiver.push(email);
    var userReceiver = [];
    userReceiver.push(yhtUserId);
    var queryContacts = extrequire("GT5258AT16.contacts.queryContacts");
    var contactsRes = queryContacts.execute({ partnerId });
    var contactRes = contactsRes.contactRes;
    for (var num111 = 0; num111 < contactRes.length; num111++) {
      var contact = contactRes[num111];
      if (!mailReceiver.includes(contact.email)) {
        mailReceiver.push(contact.email);
      }
      if (!userReceiver.includes(contact.yhtUserId)) {
        userReceiver.push(contact.yhtUserId);
      }
    }
    if (mailReceiver.length > 0) {
      sendResult.mailRes = sendMailMessage(mailReceiver, emailContent);
    }
    if (userReceiver.length > 0) {
      sendResult.dbRes = sendDBMessage(userReceiver, emailContent, webUrl, mUrl);
    }
    return sendResult;
  }
}
exports({ entryPoint: MyAPIHandler });