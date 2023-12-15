let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var body = '{"context":{"EntCode":"001","CultureName":"zh-CN","OrgCode":"99","UserCode":"demo"},"jSON":""}';
    var strResponse = postman("post", "http://19.29.180.194/U9/restServices/UFIDA.U9.CUST.KLYSapMOSendSV.IKLYSapMOSendSVC.svc/do", header, body);
    return {};
  }
}
exports({ entryPoint: MyTrigger });