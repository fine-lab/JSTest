let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    var user = request.user;
    var url = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForReject";
    var akey = "yourkeyHere";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    datas.forEach((data) => {
      var hhtObj = {
        akey: akey,
        billNo: data.dayclosecode,
        shopCode: data.erporgcode,
        loginCode: user.userCode,
        loginName: user.userName
      };
      var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(hhtObj));
      var strResponseobj = JSON.parse(strResponse);
    });
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });