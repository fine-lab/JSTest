let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let mobileNum = request.shoukuanfuzerendianhua;
    let content = request.content;
    let timestamp = Date.parse(new Date());
    let body = {
      timestamp: timestamp,
      mobileNum: [mobileNum],
      content: content
    };
    let strResponse = postman("post", "https://www.example.com/", null, JSON.stringify(body));
    let returnData = JSON.parse(strResponse);
    return { res: body };
  }
}
exports({ entryPoint: MyAPIHandler });