let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(param) {
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      mid: "youridHere",
      archiveId: "yourIdHere",
      sum: 1300,
      settleSum: 1300,
      discount: 1,
      actionTypes: 1,
      isExternalDiscount: 0,
      voucherCode: "001",
      source1: "x0001",
      paymentWay: 1
    };
    var requsetData = {
      1300: "123"
    };
    //获取token
    // 请求数据
    return {
      param: param,
      requsetData: requsetData
    };
  }
}
exports({ entryPoint: MyAPIHandler });