let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let token = "Basic eHVleGl3YWVkdUAxMjYuY29tOmFzdWVjODNxeWJqYnIzY2U=";
    let body = {};
    let header = { Authorization: token, apicode: "adc3a39f-eb8b-4b38-9c4c-a20d79fe6a5e" };
    let strResponse = postman("propfind", "https://dav.jianguoyun.com/dav/公司/用友存储/测试", JSON.stringify(header), JSON.stringify(body));
    throw new Error(JSON.stringify(strResponse));
  }
}
exports({ entryPoint: MyAPIHandler });