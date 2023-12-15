let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.requestData === undefined) {
      throw new Error("空值");
    }
    let requestData = JSON.parse(param.requestData);
    let code = requestData.code;
    let id = requestData["orderPrices!orderId"];
    let createTime = requestData.createTime;
    let body = { code: code, id: id, status1: 0, createTime: createTime };
    let func1 = extrequire("SCMSA.saleOrderRule.getToken");
    let resToken = func1.execute();
    let token = resToken.access_token; // BIP门户取值
    // 用新的数据，来同步到超时取消销售订单
    let url = "https://www.example.com/";
    let strResponse = postman("post", url + token, "", JSON.stringify(body));
    return param;
  }
}
exports({ entryPoint: MyTrigger });