let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var access_token = "yourtokenHere";
    var url = "https://www.example.com/" + access_token;
    var header = { "Content-Type": "application/json" };
    header = JSON.stringify(header);
    var body = {
      externalData: {
        parentorgid: "",
        enable: ""
      }
    };
    body = JSON.stringify(body);
    var strResponse = postman("post", url, header, body);
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });