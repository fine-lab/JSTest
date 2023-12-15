let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orderId = request.id;
    var yhtToken = JSON.parse(AppContext()).token;
    let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/YonSuite/${orderId}/files?includeChild=false&ts=1655781730750&pageSize=10`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${yhtToken}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    let count = JSON.parse(apiResponse).count;
    return { count };
  }
}
exports({ entryPoint: MyAPIHandler });