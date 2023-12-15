let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var businessId = request.businessId;
    var baseUrl = request.baseUrl;
    let token = JSON.parse(AppContext()).token;
    //附件的fileid
    let attach = businessId;
    let url = `${baseUrl}/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=13837116323&pageSize=1000`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    return JSON.parse(apiResponse);
  }
}
exports({ entryPoint: MyAPIHandler });