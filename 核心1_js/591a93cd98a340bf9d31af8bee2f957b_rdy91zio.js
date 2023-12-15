let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //定义销售发票存储数组
    var ys_salesSlip = new Array();
    //获取crm的token
    const crm_token_Url = "https://www.example.com/";
    const crm_Url = "https://www.example.com/";
    const objName = "kpls";
    const token_body = {
      client_id: "youridHere",
      client_secret: "yoursecretHere",
      password: "yourpasswordHere",
      username: "https://www.example.com/",
      grant_type: "password",
      redirect_uri: "https://api.tencent.xiaoshouyi.com"
    };
    //调用crm接口获取token
    var crm_token_link = postman("post", crm_token_Url, null, JSON.stringify(token_body));
    var crm_token_link_value = JSON.parse(crm_token_link);
    var crm_token = crm_token_link_value.access_token;
    //获取销售发票的相关数据
    ys_salesSlip = param.return;
    var ys_salesSlip_value = JSON.stringify(ys_salesSlip);
    var other = JSON.parse(ys_salesSlip_value);
    var other_value = other.saleInvoiceDetails;
    var ys_salesSlip_code = other.code;
    //获取开票日期
    var ys_date_value = other.createDate;
    var acceptDate = new Date(ys_date_value);
    var seperator1 = "-";
    var year = acceptDate.getFullYear();
    var month = acceptDate.getMonth() + 1;
    var strDate = acceptDate.getDate() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var invoiceType = other.bdInvoiceTypeId;
    var invoice = "";
    //判断增值税类型
    if (invoiceType == 4) {
      invoice = 1;
    } else if (invoiceType == 3) {
      invoice = 2;
    } else if (invoiceType == 0) {
      invoice = 5;
    } else if (invoiceType == 3200) {
      invoice = 4;
    }
    //获取发票描述
    var remark = other.saleInvoiceDefineCharacter.ICE00302_name;
    //定义crm接口数据
    var crm_header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + crm_token
    };
    //遍历ys子表的数据
    for (let i = 0; i < other_value.length; i++) {
      let item = {
        invoiceType: invoice, //发票类型   （发票类型）
        code: other_value[i].id, //erp唯一流水号    //id
        orderCode: other_value[i].orderNo, //crm订单id
        invoiceDate: currentdate, //开票日期         （单据日期）
        totalPrice: other_value[i].oriSum, //开票总金额        （主表-含税金额）
        number: other_value[i].qty, //数量                    （数量？计价数量?)   （qty）
        homeAmount: other_value[i].natSum, //本币金额		(含税金额）（oriSum）
        remark: remark, //发票描述	               //
        company: other.orgName, //乙方开票公司    （开票组织）（orgName）
        status: 2
      };
      var rows = new Array();
      rows.push(item);
      var crm_body = {
        objName: objName,
        rows: rows
      };
      //将数据推送给crm接口
      var crm_link = postman("post", crm_Url, JSON.stringify(crm_header), JSON.stringify(crm_body));
    }
    //将数据收款单数据推送到CRM
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});