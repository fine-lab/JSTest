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
    let func1 = extrequire("GT31982AT38.config.getOpenApiTaken");
    let res = func1.execute(request);
    let configfun = extrequire("GT31982AT38.config.config");
    let config = configfun.execute(request);
    //使用公共函数--------------end
    var token = res.access_token;
    var deptId = request;
    var requrl = config.config.sandboxopenapiurl + "/yonbip/fi/payment/save?access_token=" + token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var strResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    if (responseObj.data.failCount == 0) {
      var object = { id: main.id, isSync: "1" };
      ObjectStore.updateById("GT31982AT38.GT31982AT38.prepayment_zp", object, "312a793e");
    }
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });