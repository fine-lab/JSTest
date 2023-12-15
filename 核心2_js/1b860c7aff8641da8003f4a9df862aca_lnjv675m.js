let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //预警策略
    let earlyWarning = request.earlyWarning;
    //条目的单笔金额
    let tran_amt_debit = earlyWarning.tran_amt_debit;
    //预警的单笔金额
    let SingleAmount = earlyWarning.SingleAmount;
    //银行账户
    let BankAccount_name = earlyWarning.BankAccount_name;
    //交易时间
    let tranTime = earlyWarning.tranTime;
    //组织名称
    let org_id_name = earlyWarning.org_id_name;
    //对方户名
    let to_acctName = earlyWarning.to_acctName;
    //对方账号
    let to_acct_no = earlyWarning.to_acct_no;
    //账号
    let BankAccount_no = earlyWarning.BankAccount_no;
    //摘要
    let remark = earlyWarning.remark;
    //备注
    let notes = earlyWarning.notes;
    //接收预警用户ID
    var receiver = earlyWarning.Userids;
    var channels = ["uspace"];
    var title = "大额支付提示";
    var content =
      "公司名称：" +
      org_id_name +
      "\n银行账户：" +
      BankAccount_name +
      "\n银行账号：" +
      BankAccount_no +
      "\n交易时间：" +
      tranTime +
      "\n" +
      "\n对方户名：" +
      to_acctName +
      "\n对方账号：" +
      to_acct_no +
      "\n支付金额：" +
      tran_amt_debit;
    if (remark !== undefined) {
      content = content + "\n交易摘要：" + remark;
    }
    if (notes !== undefined) {
      content = content + "\n交易备注：" + notes;
    }
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      channels: channels,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });