let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let token = JSON.parse(AppContext()).token;
    let attach = request.attach;
    let url = `https://dbox.diwork.com/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=1655781730750&pageSize=10`;
    let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
    let body = {};
    let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponse };
    throw new Error("Missing attach");
  }
}
exports({ entryPoint: MyAPIHandler });