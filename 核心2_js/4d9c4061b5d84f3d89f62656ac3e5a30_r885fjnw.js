let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      apicode: "177b428d-c46c-4c48-af4b-bfa4fedcee5d",
      appkey: "yourkeyHere"
    };
    let apiResponse = apiman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    throw new Error(responseObj);
    return {
      url: "https://www.baidu.com",
      msg: "111"
    };
  }
}
exports({ entryPoint: MyAPIHandler });