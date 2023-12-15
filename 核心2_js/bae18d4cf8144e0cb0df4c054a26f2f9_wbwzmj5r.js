let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var main = request.params.billData;
    main._status = "Insert";
    var ch = request.params.billData.prepaybillb_ljcList;
    for (let i in ch) {
      ch[i]._status = "Insert";
    }
    main.PayBillb = ch;
    delete main.prepaybillb_ljcList;
    var apiData = { data: [main] };
    //使用公共函数--------------begin
    let func1 = extrequire("GT66350AT5.common.getOpenApiToken");
    let res = func1.execute(request);
    let configfun = extrequire("GT66350AT5.common.config");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var requrl = config.config.baseUrl + "/yonbip/fi/payment/save?access_token=" + token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var strResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    if (responseObj.data.failCount == 0) {
      var object = { id: main.id, isSync: "1" };
      ObjectStore.updateById("GT66350AT5.GT66350AT5.prepayment_ljc", object, "687cbd9a");
    }
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });