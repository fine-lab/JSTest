let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    let token_url = "https://www.example.com/";
    var token_strResponse = postman("GET", token_url, "form", null, null);
    var token_result = JSON.parse(token_strResponse);
    var access_token = token_result.access_token;
    //消息推送
    let url = "https://www.example.com/" + access_token;
    let header = { "Content-Type": "application/json;charset=utf-8" };
    let body = {
      touser: "odr016a630BTPUjFd-rDIqYXAQiE",
      template_id: "youridHere",
      data: {
        test: {
          value: "巧克力"
        },
        keyword2: {
          value: "39.8元"
        }
      }
    };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var result = JSON.parse(strResponse);
    return { result: result, access_token: access_token };
  }
}
exports({ entryPoint: MyAPIHandler });