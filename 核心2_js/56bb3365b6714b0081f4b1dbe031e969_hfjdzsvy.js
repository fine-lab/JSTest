let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var server = extrequire("GT15312AT4.tool.getServer").execute();
    let header = extrequire("GT15312AT4.tool.getApiHeader").execute();
    var type = request.type;
    var accountId = request.accountId;
    var regionIds = request.regionIds;
    // 拼接请求地址
    var regionParam = "";
    for (var i = 0; i < regionIds.length; i++) {
      regionParam += "&regionIds=" + regionIds[i];
    }
    var requestUrl = server.url + "/api/app-cmp-console/resaccount/synchronizeResource?ids=" + accountId + "&types=" + type + regionParam;
    var strResponse = postman("POST", requestUrl, JSON.stringify(header), "{}");
    var responseObj = JSON.parse(strResponse);
    return responseObj;
  }
}
exports({ entryPoint: MyAPIHandler });