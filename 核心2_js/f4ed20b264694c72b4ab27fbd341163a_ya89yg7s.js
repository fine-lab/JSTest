let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var code = param["fullBills"][0]["code"];
    var access_token = "yourtokenHere";
    var param = "access_token=" + access_token + "&billNo=" + code;
    let url = "https://www.example.com/" + param;
    let header = {};
    let body = {};
    let strResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    throw new Error(JSON.stringify(strResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });