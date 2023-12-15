let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let body = {
        billno: request.billno,
        billtype: request.billtype
      };
      let url = "http://112.5.195.119:8081/middle/sysDataToNc";
      //信息头
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let loadConditionKeyResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
      return { loadConditionKeyResponse };
    } catch (e) {
      throw new Error("推送NC日志异常");
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});