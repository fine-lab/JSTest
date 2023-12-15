let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var reqBodyData = request.reqBody;
    var uri = request.uri;
    //获取开放平台token
    let tokenFun = extrequire("GT12951AT32.config.getApiAccessToken");
    let tokenRes = tokenFun.execute(request);
    var access_token = tokenRes.access_token;
    //获取配置文件基础路径
    let configFun = extrequire("GT12951AT32.config.baseConfig");
    let configRes = configFun.execute(request);
    var baseUrl = configRes.config.baseUrl;
    var useUrl = baseUrl + uri + "?access_token=" + access_token;
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var strResponse = postman("POST", useUrl, JSON.stringify(header), JSON.stringify(reqBodyData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });
Copy;
新增付款保存api函数;
图6;
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var main = request.params.billData;
    main._status = "Insert";
    var ch = request.params.billData.paybillbapply0526List;
    for (let i in ch) {
      ch[i]._status = "Insert";
    }
    main.PayBillb = ch;
    delete main.paybillbapply0526List;
    var apiData = { data: [main] };
    //使用公共函数--------------begin
    let func1 = extrequire("GT10894AT82.common.getOpenApiToken");
    let res = func1.execute(request);
    let configfun = extrequire("GT10894AT82.common.config");
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
      ObjectStore.updateById("GT10894AT82.GT10894AT82.paymentapply0526", object, "b1c1b909");
    }
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });