let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let code = param.data[0].code;
    let sql =
      "select settlementOrNot,b.dr dr,b.poCode poCode,b.salesOutId salesOutId,b.salesDeliverysId salesDeliverysId from AT18623B800920000A.AT18623B800920000A.consignment inner join AT18623B800920000A.AT18623B800920000A.consignmentList b on id=b.consignment_id where code='" +
      code +
      "' and b.dr=0";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res.length > 0) {
      if (res[0].settlementOrNot == "YJS") {
        let poCode = [];
        res.forEach((item, index) => {
          if (item.poCode) {
            poCode.push(item.poCode);
          }
        });
        if (poCode.length > 0) {
          sql = "select code from pu.purchaseorder.PurchaseOrder where code in(" + poCode + ")";
          console.log(sql + "长度" + JSON.stringify(res));
          let Orders = ObjectStore.queryByYonQL(sql, "upu");
          if (Orders.length > 0) {
            let errmsg = "已生成采购订单,单号[";
            Orders.forEach((v, vindex) => {
              errmsg += v.code + ",";
            });
            errmsg += "]结算单不可删除";
            throw new Error(errmsg);
          }
        }
        //分别进行更新销售结算状态
      }
    }
    return {};
  }
  classifyArrayGroupBySameFieldAlpha(arr, filed) {
    let temObj = {};
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (!temObj[item[filed]]) {
        temObj[item[filed]] = [item];
      } else {
        temObj[item[filed]].push(item);
      }
    }
    let resArr = [];
    Object.keys(temObj).forEach((key) => {
      resArr.push({
        key: key,
        data: temObj[key]
      });
    });
    return resArr;
  }
}
exports({ entryPoint: MyTrigger });