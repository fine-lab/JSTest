let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT6923AT3.checkOrderBe.getAccessToken");
    let res = func1.execute(null, null);
    let token = res.access_token;
    let orderCode = request.code;
    let orderId = request.id;
    let rebateMoney = request.rebateMoney;
    let totalMoney = request.totalMoney;
    let data = {
      billnum: "voucher_order",
      datas: [
        {
          id: orderId,
          code: orderCode,
          orderDefineCharacter: [
            {
              headDefine9: rebateMoney,
              headDefine10: totalMoney,
              isHead: true,
              isFree: false
            }
          ]
        }
      ]
    };
    var saveOrder = postman("post", "https://www.example.com/" + token, "", JSON.stringify(data));
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });