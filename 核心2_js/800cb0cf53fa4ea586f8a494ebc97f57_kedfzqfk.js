let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取数据中心url
    let funcUrl = extrequire("ST.backDesignerFunction.gateWayUrl");
    let urlRes = funcUrl.execute(null);
    var gatewayUrl = urlRes.gatewayUrl;
    var updateUrl = gatewayUrl + "/yonbip/sd/api/updateDeliveryDefineCharacter";
    let queryBillSql = "select * from voucher.delivery.DeliveryVoucher where id='" + request.id + "'";
    var bill = ObjectStore.queryByYonQL(queryBillSql, "udinghuo");
    var bodyData = {
      id: request.id,
      deliveryVoucherDefineCharacter: {
        id: bill[0].deliveryVoucherDefineCharacter.id,
        attrext9: request.tracknum //快递单号
      }
    };
    let body = { datas: bodyData };
    var strResponse = openLinker("POST", updateUrl, "ST", JSON.stringify(body));
    var responseObj = JSON.parse(strResponse);
    if (responseObj.code != 200) {
      throw new Error("回更快递单号出错：" + responseObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });