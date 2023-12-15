let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });