let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ent_name = request.ent_name;
    let paramsObj = {
      ent_name: ent_name,
      appKey: "yourKeyHere",
      appSecret: "test",
      serverUrl: "https://www.example.com/"
    };
    let strResponse = postman("post", url, null, JSON.stringify(paramsObj));
    return { strResponse: strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });