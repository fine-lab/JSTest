let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var obj = JSON.parse(res);
    let header = { appkey: "yourkeyHere", appsecret: "yoursecretHere" };
    var isAdmin = function (yhtUserId) {
      let body = { yhtUserId: yhtUserId };
      let str = ublinker("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
      var response = JSON.parse(str);
      if (response && response.status == 1) {
        return response.flag == 1;
      } else {
        throw new Error("查询失败");
      }
    };
    let body = { pageNumber: 1, pageSize: 100, yhtTenantId: obj.currentUser.tenantId };
    let url = "https://www.example.com/";
    let apiResponse = ublinker("POST", url, JSON.stringify(header), JSON.stringify(body));
    var response = JSON.parse(apiResponse);
    if (response.code == "200") {
      var content = response.data.content;
    } else {
    }
    return { apiResponse };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });