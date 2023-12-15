let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let idnumber = request.idnumber;
    let queryBillSql = "select * from voucher.delivery.DeliveryVoucher where id=" + idnumber;
    var res = ObjectStore.queryByYonQL(queryBillSql, "udinghuo");
    if (res.length == 0) {
      throw new Error("未查询出数据");
    }
    var typeValue = res[0].deliveryVoucherDefineCharacter.attrext8;
    var mdhValue = res[0].deliveryVoucherDefineCharacter.attrext9;
    if ("顺丰" == typeValue) {
      throw new Error("非菜鸟数据，不可打印！");
    }
    if (mdhValue == null) {
      throw new Error("未发送快递，不可打印！");
    }
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let bodydata = { mdh: mdhValue };
    var selectUrl = "http://123.57.144.10:9997/toCn/selectPrintdata";
    var strResponseRes = postman("POST", selectUrl, JSON.stringify(header), JSON.stringify(bodydata));
    var strResponse = JSON.parse(strResponseRes);
    if (strResponse.code == 200) {
      var queryBody = "select count(subQty) subQty from voucher.delivery.DeliveryDetail where deliveryId='" + idnumber + "'";
      var bodyRes = ObjectStore.queryByYonQL(queryBody, "udinghuo");
      var subQtyValue = bodyRes[0].subQty;
      var dataRuslt = {
        mdh: mdhValue,
        subQty: subQtyValue,
        printdata: strResponse.msg
      };
      return { dataRuslt };
    } else {
      throw new Error(strResponse.msg);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });