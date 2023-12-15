let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = {
      mailno: "340987657890876"
    };
    let header = {
      "Content-Type": "application/json"
    };
    let url = "https://www.example.com/";
    let apiResponses = postman("post", url, JSON.stringify(header), JSON.stringify(param));
    let json = JSON.parse(apiResponses);
    return { json };
  }
}
exports({ entryPoint: MyAPIHandler });