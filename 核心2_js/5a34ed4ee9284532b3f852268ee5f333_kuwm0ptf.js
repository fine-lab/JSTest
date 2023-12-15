let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var main = request.params.billData;
    main._status = "Insert";
    var ch = request.params.billData.prepaybillb0526List;
    for (let i in ch) {
      ch[i]._status = "Insert";
    }
    main.PayBillb = ch;
    delete main.prepaybillb0526List;
    var apiData = { data: [main] };
    //使用公共函数--------------begin
    let func1 = extrequire("GT98827AT139.common.token");
    let res = func1.execute(request);
    let configfun = extrequire("GT98827AT139.common.Profile");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var requrl = config.config.baseUrl + "/yonbip/fi/payment/save?access_token=" + token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var strResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    if (responseObj.data.failCount == 0) {
      var object = { id: main.id, isSync: "1" };
      ObjectStore.updateById("GT98827AT139.GT98827AT139.prepayment_p", object, "338ec443");
    }
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });