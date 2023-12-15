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
    if (request.account) {
      query = query + "&account=" + request.account;
    }
    if (request.type) {
      query = query + "&type=" + request.type;
    }
    var requestUrl = server.url + "/api/app-cmp-console/resaccount/list" + query;
    var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      return responseObj;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });