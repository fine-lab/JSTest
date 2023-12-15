let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取配置文件的接口请求的url
    let envconfigFun = extrequire("GT103422AT170.open.gettoken");
    let access_token = envconfigFun.execute(request).access_token;
    let url = "https://www.example.com/";
    var strResponse = postman("GET", url, null, null);
    let ss = JSON.parse(strResponse);
    let ContentType = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": ContentType
    };
    let telephone = request.data.telephone;
    let body = {
      searchcode: telephone
    };
    let uri = ss.data.gatewayUrl + "/yonbip/uspace/users/search_page_list?access_token=" + access_token;
    var resultName = postman("POST", uri, JSON.stringify(header), JSON.stringify(body));
    var res = JSON.parse(resultName);
    return res;
    //请求体封装
    var pageIndex = "1";
    var pageSize = "100";
  }
}
exports({ entryPoint: MyAPIHandler });