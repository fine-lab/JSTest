let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    let partnerKey1 = "6EJC4UA5";
    var s1 = {
      logisticID: "yourIDHere", //response.logisticID,
      logisticCompanyID: "yourIDHere"
    };
    var urlCode1 = UrlEncode(JSON.stringify(s1));
    let signStr1 = JSON.stringify(s1) + partnerKey1;
    var sign1 = MD5Encode(signStr1);
    let url1 = "https://www.example.com/" + urlCode1 + "&sign=" + sign1;
    var strResponse1 = postman("POST", url1, JSON.stringify(header), JSON.stringify(null));
    let response1 = JSON.parse(strResponse1);
    return { response1 };
  }
}
exports({ entryPoint: MyAPIHandler });