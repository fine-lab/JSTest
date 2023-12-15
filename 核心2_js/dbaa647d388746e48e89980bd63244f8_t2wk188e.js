let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var access_token = request.access_token;
    let suffix = "?" + "access_token=" + access_token;
    let mode = "POST";
    var queryUrl = "https://www.example.com/" + suffix;
    let queryParam = { pageIndex: 1, pageSize: 1000 };
    let queryData = CallAPI(mode, queryUrl, queryParam);
    queryData = JSON.parse(queryData);
    //调用API
    function CallAPI(mode, url, param) {
      //请求头
      var header = { "Content-Type": "application/json" };
      var strResponse = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
      //返回数据
      return strResponse;
    }
    return queryData;
  }
}
exports({ entryPoint: MyAPIHandler });