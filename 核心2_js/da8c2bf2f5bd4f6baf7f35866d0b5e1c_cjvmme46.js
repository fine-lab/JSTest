let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var parseObj = JSON.parse(res);
    //租户id
    let tenantId = parseObj.currentUser.tenantId;
    let reqwlListurl = "https://www.example.com/" + tenantId;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let rst;
    let custResponse = postman("GET", reqwlListurl, JSON.stringify(header));
    let custresponseobj = JSON.parse(custResponse);
    if ("00000" == custresponseobj.code) {
      rst = custresponseobj.data.gatewayUrl;
    }
    return { gatewayUrl: rst };
  }
}
exports({ entryPoint: MyTrigger });