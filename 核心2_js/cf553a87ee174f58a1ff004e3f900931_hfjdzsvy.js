let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    // 参数
    var query = "";
    query = query + "?current=" + request.current;
    query = query + "&size=" + request.size;
    if (request.tagKey) {
      query = query + "&tagKey=" + request.tagKey;
    }
    if (request.tagValue) {
      query = query + "&tagValue=" + request.tagValue;
    }
    if (request.accountIds && request.accountIds.length > 0) {
      for (var i = 0; i < request.accountIds.length; i++) {
        query = query + "&accountIds=" + request.accountIds[i];
      }
    }
    if (request.tagType) {
      query = query + "&tagType=" + request.tagType;
    }
    var requestUrl = server.url + "/api/app-cmp-console/res/tags" + query;
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });