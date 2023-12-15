let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    // 参数
    var query = "";
    query = query + "?current=" + request.current;
    query = query + "&size=" + request.size;
    if (request.name) {
      query = query + "&name=" + request.name;
    }
    if (request.types && request.types.length > 0) {
      for (var i = 0; i < request.types.length; i++) {
        query = query + "&types=" + request.types[i];
      }
    }
    if (request.accountIds && request.accountIds.length > 0) {
      for (var i = 0; i < request.accountIds.length; i++) {
        query = query + "&accountIds=" + request.accountIds[i];
      }
    }
    if (request.regionIds && request.regionIds.length > 0) {
      for (var i = 0; i < request.regionIds.length; i++) {
        query = query + "&regionIds=" + request.regionIds[i];
      }
    }
    if (request.tagIds && request.tagIds.length > 0) {
      for (var i = 0; i < request.tagIds.length; i++) {
        query = query + "&tagIds=" + request.tagIds[i];
      }
    }
    if (request.vmId) {
      query = query + "&vmId=" + request.vmId;
    }
    if (request.instanceStatus) {
      query = query + "&instanceStatus=" + request.instanceStatus;
    }
    var requestUrl = server.url + request.url + query;
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });