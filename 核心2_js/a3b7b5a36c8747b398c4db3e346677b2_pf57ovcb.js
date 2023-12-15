let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let httpURL = "https://c2.yonyoucloud.com"; //域名升级，世贸生产域名变量
    //主实体：voucher.order.Order；子实体：voucher.order.OrderDetail;子表集合属性	orderDetails;子表外键	orderId
    let sql = "";
    sql = "select orderId.id,orderId.code,sum(subQty),sum(oriSum) from voucher.order.OrderDetail"; // where orderId.code='000901' ";
    //订单有效状态
    sql += " where orderId.status = '1'";
    //签收单状态
    sql += " and (orderId.headFreeItem.define14 is null or orderId.headFreeItem.define14='未签收')";
    //订单状态
    sql += " and orderId.nextStatus in ('ENDORDER','TAKEDELIVERY','DELIVERY_TAKE_PART','DELIVERY_PART')";
    sql += " group by orderId.id,orderId.code";
    let resOrder = ObjectStore.queryByYonQL(sql, "udinghuo");
    if (resOrder.length > 0) {
      for (let i = 0; i < resOrder.length; i++) {
        let orderQty = resOrder[i].subQty != undefined ? resOrder[i].subQty : 0;
        let orderSum = resOrder[i].oriSum != undefined ? resOrder[i].oriSum : 0;
        //根据订单id查询签收单
        sql = "select orderId,sum(receivedQty),sum(oriSum) from usp.signconfirmation.SignConfirmations ";
        sql += " where mainid.status = 1 ";
        sql += " and orderId = '" + resOrder[i].orderId_id + "'";
        sql += " group by orderId";
        let resReceiver = ObjectStore.queryByYonQL(sql, "uscmpub");
        if (resReceiver.length > 0) {
          let receiverQty = resReceiver[0].receivedQty != undefined ? resReceiver[0].receivedQty : 0;
          let receiverSum = resReceiver[0].oriSum != undefined ? resReceiver[0].oriSum : 0;
          //调用更新自定义项接口
          let url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
          let definesInfo = {};
          definesInfo["isHead"] = true;
          definesInfo["isFree"] = true;
          definesInfo["define16"] = resReceiver[0].oriSum;
          definesInfo["define15"] = resReceiver[0].receivedQty;
          definesInfo["define13"] = "未生成"; //是否生成签收凭证：1-未生成，2-已生成
          //订单与签收单的金额数量相等则更新状态为"2-已签收"，否则更新为"1-未签收"
          if (orderQty == receiverQty && orderSum == receiverSum) {
            //引入日期格式化函数
            let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
            //当天日期
            let sCurrDate = funFmtDt.execute(new Date());
            definesInfo["define14"] = "已签收";
            definesInfo["define12"] = sCurrDate;
          } else {
            definesInfo["define14"] = "未签收";
          }
          let body = {
            billnum: "voucher_order",
            datas: [
              {
                id: resOrder[i].orderId_id,
                code: resOrder[i].orderId_code,
                definesInfo: [definesInfo]
              }
            ]
          };
          let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });