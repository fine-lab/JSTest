let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //调用了付款保存接口
    request.uri = "/yonbip/fi/payment/save";
    var reqBody = request.params.billData;
    reqBody._status = "Insert";
    reqBody.tradetype = reqBody.bustype;
    var ch = reqBody.paybillbnishch2List;
    for (let i in ch) {
      ch[i]._status = "Insert";
    }
    reqBody.PayBillb = ch;
    delete reqBody.paybillbnishch2List;
    request.reqBody = { data: [reqBody] };
    let apiUtilFunc = extrequire("GT12951AT32.config.openApiUtils");
    let apiUtilRes = apiUtilFunc.execute(request);
    if (apiUtilRes.responseObj.data.failCount == 0) {
      var object = { id: reqBody.id, isSync: "1" };
      var res = ObjectStore.updateById("GT12951AT32.GT12951AT32.paymentnishch2", object, "294cbb05");
    }
    return { responseObj: apiUtilRes.responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });