let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //调用了付款保存接口
    request.uri = "/yonbip/fi/payment/save";
    var reqBody = request.params.billData;
    reqBody._status = "Insert";
    reqBody.tradetype = reqBody.bustype;
    var ch = reqBody.paybillbapplyList;
    for (let i in ch) {
      ch[i]._status = "Insert";
    }
    reqBody.PayBillb = ch;
    delete reqBody.paybillbapplyList;
    request.reqBody = { data: [reqBody] };
    let apiUtilFunc = extrequire("GT66350AT5.common.openApiUtils");
    let apiUtilRes = apiUtilFunc.execute(request);
    if (apiUtilRes.responseObj.data.failCount == 0) {
      var object = { id: reqBody.id, isSync: "1" };
      var res = ObjectStore.updateById("GT66350AT5.GT66350AT5.payment", object, "48b31ea5");
    }
    return { responseObj: apiUtilRes.responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });