let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billId = request.idnumber;
    let array = request.array;
    if (array.length == 0) {
      throw new Error("快递类型转换失败！");
    }
    //查询主表
    let queryBillSql = "select * from voucher.delivery.DeliveryVoucher where id='" + billId + "'";
    var bill = ObjectStore.queryByYonQL(queryBillSql, "udinghuo");
    //查询子表
    let queryBodySql = "select * from voucher.delivery.DeliveryDetail where  deliveryId='" + billId + "'";
    var bodyRes = ObjectStore.queryByYonQL(queryBodySql, "udinghuo");
    bill[0].bodys = bodyRes;
    bill[0].def4 = bill[0].deliveryVoucherDefineCharacter.attrext8; //快递类型
    bill[0].def5 = bill[0].deliveryVoucherDefineCharacter.attrext9; //快递号
    for (var i = 0; i < array.length; i++) {
      let bodydata = array[i];
      if ("申通" == bill[0].def4) {
        bill[0].def4Vcode = "STO";
      } else if (bill[0].def4 == bodydata.name) {
        bill[0].def4Vcode = bodydata.code;
      }
    }
    return { bill };
  }
}
exports({ entryPoint: MyAPIHandler });