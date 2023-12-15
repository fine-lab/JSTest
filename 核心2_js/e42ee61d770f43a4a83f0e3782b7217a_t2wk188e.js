let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var billdate = request.billdate;
    var ware_id = request.ware_id;
    var access_token = request.access_token;
    let suffix = "?" + "access_token=" + access_token;
    let mode = "POST";
    let queryStoreInListUrl = "https://www.example.com/" + suffix;
    let queryStoreInParam = {
      access_token: access_token,
      pageIndex: 1,
      pageSize: 100000,
      vouchdate: billdate + "|" + nowDate,
      inwarehouse_name: ware_id
    };
    let queryCurrentStockData = CallAPI(mode, queryCurrentStockUrl, queryCurrentStockParam);
    //调用API
    function CallAPI(mode, url, param) {
      //请求头
      var header = { "Content-Type": "application/json" };
      var strResponse = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
      //返回数据
      return strResponse;
    }
    return { queryCurrentStockData };
  }
}
exports({ entryPoint: MyAPIHandler });