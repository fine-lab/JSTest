let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/" + request.access_token + "&id=" + request.id;
    let strResponse = postman("get", url, null, null);
    let responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return { data: responseObj.data.merchantAddressInfos };
    }
    return { exception: "没有查询到对应的物料详情" + responseObj.message };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });