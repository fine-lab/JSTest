let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var rangeUrl = "https://www.example.com/" + request.access_token;
    var rangeParam = {
      enable: "1",
      pageIndex: 1,
      pageSize: 10,
      code: request.productCode
    };
    var strResponse = postman("post", rangeUrl, null, JSON.stringify(rangeParam));
    var responseObj = JSON.parse(strResponse);
    if ("200" !== responseObj.code) {
      return { exception: "" + responseObj.message };
    }
    var rangeId = responseObj.data.recordList[0].productApplyRangeId;
    var url = "https://www.example.com/" + request.access_token + "&id=" + request.productId + "&productApplyRangeId=" + rangeId;
    strResponse = postman("get", url, null, null);
    responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return { exception: "没有查询到对应的物料详情" + responseObj.message };
  }
}
exports({ entryPoint: MyAPIHandler });