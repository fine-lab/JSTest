let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var dtRes = ObjectStore.selectById("GT5258AT16.GT5258AT16.duty_outs_resource", { id }, "8e14591f");
    if (dtRes == null || dtRes.id == null) {
      return {};
    }
    var email = dtRes.email;
    var code = dtRes.code;
    var yhtUserId = dtRes.yhtUserid;
    var sourceOrgName = dtRes.sourceOrgName;
    var projectName = dtRes.projectName;
    var projectArea = dtRes.projectArea;
    var partnerId = dtRes.org_id;
    var deliveryTypes = dtRes.deliveryTypes;
    var cooperationMode = dtRes.cooperationMode;
    var personNum = dtRes.personNum;
    var expectPeriod = dtRes.expectPeriod;
    var sendResult = {};
    function sendMailMessage(mailReceiver, emailContent) {
      // 验证结果：result: "{\"msg\":\"消息发送成功\",\"msgList\":[{\"responseStatusCode\":\"1\",\"receiver\":\"linjiec@yonyou.com\",\"responseContent\":\"向linjiec@yonyou.com发送邮件成功\"}],\"status\":1}"
      var mailChannels = ["mail"];
      var mailMessageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        mailReceiver: mailReceiver,
        channels: ["mail"],
        subject: "外包资源回执单",
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
        subject: "外包资源回执单",
        content: content,
        messageType: "createToDo",
        createToDoExt: createToDoExt
      };
      var result = sendMessage(messageInfo);
    }
    function getDeliveryTypeNames(deliveryTypes) {
      var names = [];
      for (var di = 0; di < deliveryTypes.length; di++) {
        if (deliveryTypes[di] == "1") {
          names.push("实施");
        }
        if (deliveryTypes[di] == "2") {
          names.push("客开");
        }
        if (deliveryTypes[di] == "3") {
          names.push("咨询");
        }
        if (deliveryTypes[di] == "4") {
          names.push("运维");
        }
      }
      return join(names, ",");
    }
    //消息模板测试
    var emailContent =
      "<p>外包资源回执单</p><p>您有一个外包资源回执单待响应。</p><p>反馈单号：" +
      code +
      "</p><p>经营机构：" +
      sourceOrgName +
      '</p><p>单据地址：<a href="https://www.example.com/' +
      id +
      '?domainKey=developplatform&amp;apptype=mdf&amp;tenantId=n7ikv2mf" target="_blank">点击此处打开单据</a></p>';
    emailContent += "<p>项目名称：" + projectName + "</p>";
    emailContent += "<p>项目交付所在地：" + projectArea + "</p>";
    emailContent += "<p>交付类型：" + getDeliveryTypeNames(deliveryTypes) + "</p>";
    emailContent += "<p>合作模式：" + (cooperationMode == "1" ? "人天" : "任务") + "</p>";
    emailContent += "<p>需求人数：" + personNum + "人</p>";
    emailContent += "<p>预计工期：" + expectPeriod + "月</p>";
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