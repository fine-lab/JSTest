let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let httpUrl = "https://www.example.com/";
    let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
    let httpResData = JSON.parse(httpRes);
    if (httpResData.code != "00000") {
      throw new Error("获取数据中心信息出错" + httpResData.message);
    }
    let httpurl = httpResData.data.gatewayUrl;
    let func1 = extrequire("AT16560C6C08780007.frontDesignerFunction.token");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/digitalModel/warehouse/list?access_token=" + token;
    let body = {
      pageSize: 10,
      pageIndex: 1
    };
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    let apiResponseRes2 = JSON.parse(apiResponseRes);
    return { apiResponseRes2 };
  }
}
exports({ entryPoint: MyAPIHandler });