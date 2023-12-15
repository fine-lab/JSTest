let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //信息体
    let body = {};
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "177b428d-c46c-4c48-af4b-bfa4fedcee5d",
      appkey: "yourkeyHere"
    };
    let apiResponse = apiman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({ entryPoint: MyAPIHandler });