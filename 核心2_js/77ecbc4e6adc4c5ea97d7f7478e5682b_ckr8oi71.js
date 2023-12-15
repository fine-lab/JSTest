let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //信息头
    let headers = {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "Bearer " + request.token
    };
    //信息体
    let bodys = {};
    var responseObjs = postman("post", "https://www.example.com/" + request.value, JSON.stringify(headers), JSON.stringify(bodys));
    var resData = JSON.parse(responseObjs);
    return { resData };
  }
}
exports({ entryPoint: MyAPIHandler });