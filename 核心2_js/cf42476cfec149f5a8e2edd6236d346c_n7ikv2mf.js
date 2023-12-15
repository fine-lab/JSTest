let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mailReceiver = request.mailReceiver;
    var uspaceReceiver = request.uspaceReceiver;
    var org_id = request.org_id;
    if (!mailReceiver) {
      mailReceiver = [];
    }
    if (!uspaceReceiver) {
      uspaceReceiver = [];
    }
    //从区域划分中获取到对应组织所在区域的负责人org_id
    let queryRegionPsn = extrequire("GT5258AT16.region.queryRegionPsn");
    let regionLeader = queryRegionPsn.execute({ org_id });
    let leaders = regionLeader.regionLeader;
    if (leaders && leaders.length > 0) {
      for (var num111 = 0; num111 < leaders.length; num111++) {
        var person = leaders[num111];
        if (!mailReceiver.includes(person.email)) {
          mailReceiver.push(person.email);
        }
        if (!uspaceReceiver.includes(person.yhtuserid)) {
          uspaceReceiver.push(person.yhtuserid);
        }
      }
    } else {
      mailReceiver.push("https://www.example.com/");
      mailReceiver.push("https://www.example.com/");
      mailReceiver.push("https://www.example.com/");
      mailReceiver.push("https://www.example.com/");
      uspaceReceiver.push("15dbab5c-e734-4773-95a8-e739acc6bb54");
      uspaceReceiver.push("13b0037f-f6c6-47b2-8d79-d7a14859d096");
      uspaceReceiver.push("58bb83cd-37ad-49ec-bf0b-078de2389cf4");
      uspaceReceiver.push("a689e889-ea13-416d-be96-21b0e706fe2c");
    }
    var id = request.id;
    var code = request.code;
    var partnerName = request.partnerName;
    var responseDesc = request.responseDesc;
    var responseStatus = request.responseStatus;
    var responseTime = request.responseTime;
    var responsePsn = request.responsePsn;
    var responsePsnName = request.responsePsnName;
    var responsePsnContact = request.responsePsnContact;
    var projectName = request.projectName;
    var projectArea = request.projectArea;
    var affOrgName = request.affOrgName;
    var deliveryTypes = request.deliveryTypes;
    var cooperationMode = request.cooperationMode;
    var personNum = request.personNum;
    var expectPeriod = request.expectPeriod;
    var refuseReason = request.refuseReason;
    var reasonDetail = request.reasonDetail;
    var responseStatusName = "已承接";
    var title = "被伙伴承接";
    if (responseStatus == "3") {
      responseStatusName = "已放弃";
      title = "被伙伴放弃";
    } else if (responseStatus == "4") {
      responseStatusName = "已挂起";
      title = "被伙伴挂起";
    }
    function getRefuseReason(refuseReason) {
      if (refuseReason == "1") {
        return "资源原因";
      }
      if (refuseReason == "2") {
        return "报价原因";
      }
      if (refuseReason == "3") {
        return "工期原因";
      }
      if (refuseReason == "4") {
        return "商务原因";
      }
      if (refuseReason == "5") {
        return "其他";
      }
      if (refuseReason == "6") {
        return "机构需求关闭";
      }
      return "";
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
      "<p>外包资源预提单响应消息</p><p>您有一个外包资源预提单" +
      title +
      "。</p><p>预提单号：" +
      code +
      "</p><p>响应伙伴：" +
      partnerName +
      "</p><p>响应时间：" +
      responseTime +
      "</p><p>响应状态：" +
      responseStatusName +
      "</p>";
    if (responseStatus == "3") {
      emailContent += "<p>放弃原因：" + getRefuseReason(refuseReason) + "</p>";
      if (refuseReason == "5") {
        emailContent += "<p>其他原因：" + reasonDetail + "</p>";
      }
    }
    emailContent += "<p>反馈人：" + responsePsnName + "</p>";
    emailContent += "<p>反馈人联系方式：" + responsePsnContact + "</p>";
    emailContent += "<p>项目名称：" + projectName + "</p>";
    emailContent += "<p>项目所属机构：" + affOrgName + "</p>";
    emailContent += "<p>项目交付所在地：" + projectArea + "</p>";
    emailContent += "<p>交付类型：" + getDeliveryTypeNames(deliveryTypes) + "</p>";
    emailContent += "<p>合作模式：" + (cooperationMode == "1" ? "人天" : "任务") + "</p>";
    emailContent += "<p>需求人数：" + personNum + "人</p>";
    emailContent += "<p>预计工期：" + expectPeriod + "月</p>";
    // 验证结果：result: "{\"msg\":\"消息发送成功\",\"msgList\":[{\"responseStatusCode\":\"1\",\"receiver\":\"linjiec@yonyou.com\",\"responseContent\":\"向linjiec@yonyou.com发送邮件成功\"}],\"status\":1}"
    var mailChannels = ["mail"];
    var mailMessageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: mailChannels,
      subject: "外包资源预提单响应消息",
      content: emailContent
    };
    var result = sendMessage(mailMessageInfo);
    //验证结果：'{"msg":"消息发送成功","msgList":[{"responseStatusCode":"…84-6c48-43b7-8ba7-62a47a767034发送成功"}],"status":1}'
    var dbMessageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: ["uspace"],
      subject: "外包资源预提单响应消息",
      content: emailContent
    };
    var result = sendMessage(dbMessageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });