let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var strResponse = postman("post", "http://yongyou.test.api.xhsmfw.cn:18088" + "/gsp/udi/pushUdiInfo", null, JSON.stringify(request.body));
    var rt = JSON.parse(strResponse);
    return { rt };
  }
}
exports({ entryPoint: MyAPIHandler });