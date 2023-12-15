let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let resToken = func1.execute();
    var token = resToken.access_token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let getExchangerate = "https://www.example.com/" + token;
    //缓存数据
    var number = request.number; //销售预订单号
    let couriernumValue = request.couriernum; //快递单号
    var updatebody = { code: number, couriernum: couriernumValue };
    let body = {
      data: updatebody
    };
    let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
    let rateresponseobj = JSON.parse(rateResponse);
    if (rateresponseobj.code != "200") {
      let errorMessage = "回写销售预订单失败：" + rateresponseobj.message;
      throw new Error(errorMessage);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });