let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    var strResponse = postman("post", url, null, JSON.stringify({ id: 1, taskId: 1 }));
    throw new Error(strResponse);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });