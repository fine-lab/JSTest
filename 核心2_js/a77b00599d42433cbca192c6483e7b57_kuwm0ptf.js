let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize;
    let name = request.name;
    let body = { name: name };
    let header = {};
    let strResponse = postman("get", "http://39.106.84.51/test", JSON.stringify(header), JSON.stringify(body));
    let arr = JSON.parse(strResponse);
    return { data: arr, total: 10 };
  }
}
exports({ entryPoint: MyAPIHandler });