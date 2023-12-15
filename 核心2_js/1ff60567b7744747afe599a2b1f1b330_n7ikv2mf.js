let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    function sendMsg(dor, emailContent) {
      var mailReceiver = [];
      mailReceiver.push(dor.email);
      var userReceiver = [];
      userReceiver.push(dor.yhtUserid);
      var queryContacts = extrequire("GT5258AT16.contacts.queryContacts");
      var contactsRes = queryContacts.execute({ partnerId: dor.org_id });
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
        sendMailMessage(mailReceiver, emailContent);
      }
      if (userReceiver.length > 0) {
        var webUrl = "https://www.example.com/" + dor.id + "?domainKey=developplatform&apptype=mdf&tenantId=n7ikv2mf";
        var mUrl =
          "https://www.example.com/" +
          dor.id +
          "&readOnly=true&terminalType=3&tenantId=n7ikv2mf&from_mc_workflow=1";
        sendDBMessage(userReceiver, emailContent, webUrl, mUrl);
      }
    }
    var dorObject = { responseStatus: "4" };
    var dorRes = ObjectStore.selectByMap("GT5258AT16.GT5258AT16.duty_outs_resource", dorObject);
    for (var num = 0; num < dorRes.length; num++) {
      var dor = dorRes[num];
      var responseTime = new Date(dor.responseTime);
      var time_diff = responseTime.getTime() - new Date().getTime();
      var days = Math.floor(time_diff / (24 * 3600 * 1000));
      if (days >= 8 && days <= 12) {
        //消息模板测试
        var emailContent = "<p>外包资源回执单</p><p>您有一个外包资源回执单沟通时间过长，请尽快反馈。</p>";
        emailContent += "<p>反馈单号：" + dor.code + "</p>";
        emailContent += "<p>经营机构：" + dor.sourceOrgName + "</p>";
        emailContent += "<p>项目名称：" + dor.projectName + "</p>";
        emailContent += "<p>项目交付所在地：" + dor.projectArea + "</p>";
        emailContent += "<p>交付类型：" + getDeliveryTypeNames(dor.deliveryTypes) + "</p>";
        emailContent += "<p>合作模式：" + (dor.cooperationMode == "1" ? "人天" : "任务") + "</p>";
        emailContent += "<p>需求人数：" + dor.personNum + "人</p>";
        emailContent += "<p>预计工期：" + dor.expectPeriod + "月</p>";
        sendMsg(dor, emailContent);
      }
      if (days > 12) {
        //消息模板
        var emailContent = "<p>外包资源回执单</p><p>您有一个外包资源回执单沟通时间过长，已被系统自动放弃。</p>";
        emailContent += "<p>反馈单号：" + dor.code + "</p>";
        emailContent += "<p>经营机构：" + dor.sourceOrgName + "</p>";
        emailContent += "<p>项目名称：" + dor.projectName + "</p>";
        emailContent += "<p>项目交付所在地：" + dor.projectArea + "</p>";
        emailContent += "<p>交付类型：" + getDeliveryTypeNames(dor.deliveryTypes) + "</p>";
        emailContent += "<p>合作模式：" + (dor.cooperationMode == "1" ? "人天" : "任务") + "</p>";
        emailContent += "<p>需求人数：" + dor.personNum + "人</p>";
        emailContent += "<p>预计工期：" + dor.expectPeriod + "月</p>";
        sendMsg(dor, emailContent);
        let writeBackApply = extrequire("GT5258AT16.wbzyytd.writeBackApply");
        writeBackApply.execute({ id: dor.id, responseStatus: "3" });
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });