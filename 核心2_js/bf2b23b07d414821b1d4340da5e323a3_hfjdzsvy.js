let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    // 参数
    var query = "";
    query = query + "?scope=size";
    if (request.tagIds && request.tagIds.length > 0) {
      for (var i = 0; i < request.tagIds.length; i++) {
        query = query + "&tagIds=" + request.tagIds[i];
      }
    }
    var requestUrl = server.url + "/api/app-cmp-console/cost/resource" + query;
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });