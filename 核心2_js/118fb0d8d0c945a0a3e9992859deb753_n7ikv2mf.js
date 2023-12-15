let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mailReceiver = request.mailReceiver;
    var uspaceReceiver = request.uspaceReceiver;
    if (!mailReceiver) {
      mailReceiver = [];
    }
    if (!uspaceReceiver) {
      uspaceReceiver = [];
    }
    mailReceiver.push("https://www.example.com/");
    mailReceiver.push("https://www.example.com/");
    mailReceiver.push("https://www.example.com/");
    mailReceiver.push("https://www.example.com/");
    mailReceiver.push("https://www.example.com/");
    var code = request.code;
    var part_advisor_num = request.part_advisor_num;
    var part_contract_code = request.part_contract_code;
    var part_contract_mny = request.part_contract_mny;
    var part_create_date = request.part_create_date;
    var part_customer_name = request.part_customer_name;
    var part_end_date = request.part_end_date;
    var part_is_pre_invest = request.part_is_pre_invest;
    var part_partner_name = request.part_partner_name;
    var part_pro_month = request.part_pro_month;
    var part_project_name = request.part_project_name;
    var part_project_status = request.part_project_status;
    var part_start_date = request.part_start_date;
    //消息模板测试
    var emailContent = "<div>外包资源看板预投入消息</div>";
    emailContent += "<div>【" + part_partner_name + "】新增一张预投入信息。</div>";
    emailContent += "<div>单据号：" + code + "</div>";
    emailContent += "<div>伙伴名称：" + part_partner_name + "</div>";
    emailContent += "<div>项目名称：" + part_project_name + "</div>";
    emailContent += "<div>客户名称：" + part_customer_name + "</div>";
    emailContent += "<div>采购合同编码：" + part_contract_code + "</div>";
    emailContent += "<div>合同金额：" + part_contract_mny + "</div>";
    // 验证结果：result: "{\"msg\":\"消息发送成功\",\"msgList\":[{\"responseStatusCode\":\"1\",\"receiver\":\"linjiec@yonyou.com\",\"responseContent\":\"向linjiec@yonyou.com发送邮件成功\"}],\"status\":1}"
    var mailChannels = ["mail"];
    var mailMessageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: mailChannels,
      subject: "外包资源看板预投入消息",
      content: emailContent
    };
    if (mailReceiver && mailReceiver.length > 0) {
      sendMessage(mailMessageInfo);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });