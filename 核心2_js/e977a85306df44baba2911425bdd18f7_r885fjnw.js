let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ys_id = JSON.stringify(param.data[0].id);
    const crm_token_Url = "https://www.example.com/";
    const crm_receipt_Url = "https://www.example.com/";
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
    var crm_receipt_token = crm_token_link_value.access_token;
    return {};
  }
}
exports({ entryPoint: MyTrigger });