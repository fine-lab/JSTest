let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    // 参数
    var query = "";
    query = query + "?metric=" + request.metric;
    if (request.vmIds && request.vmIds.length > 0) {
      for (var i = 0; i < request.vmIds.length; i++) {
        query = query + "&vmIds=" + request.vmIds[i];
      }
    }
    var requestUrl = server.url + "/api/app-cmp-console/monitor/vm/last" + query;
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });