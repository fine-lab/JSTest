let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ycConUrl =
      "https://www.example.com/";
    let apiResponse = postman("get", ycConUrl, JSON.stringify({}), JSON.stringify({}));
    return { apiResponse };
    //批量更新项目交付状态
  }
}
exports({ entryPoint: MyAPIHandler });