let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql = "";
    //根据订单id查询签收单
    sql = "select orderId, max(orderCode) as orderCode, max(mainid.auditTime) as qTime, sum(receivedQty) as receivedQty,sum(oriSum) as oriSum  from usp.signconfirmation.SignConfirmations ";
    sql += " where mainid.status = 1 ";
    sql += " and mainid.auditTime>='2023-01-01 00:00:00' and mainid.auditTime<='2023-03-31 23:59:59'";
    sql += " group by orderId";
    let resReceiver = ObjectStore.queryByYonQL(sql, "uscmpub");
    for (let i = 0; i < resReceiver.length; i++) {
      sql = "select orderId.id,orderId.code,sum(subQty) as orderQty,sum(oriSum) as orderSum from voucher.order.OrderDetail";
      //订单有效状态
      sql += " where orderId='" + resReceiver[i].orderId + "'";
      let resOrder = ObjectStore.queryByYonQL(sql, "udinghuo");
      let receiverQty = resReceiver[i].receivedQty != undefined ? resReceiver[i].receivedQty : 0;
      let receiverSum = resReceiver[i].oriSum != undefined ? resReceiver[i].oriSum : 0;
      let orderQty = resOrder[0].orderQty != undefined ? resOrder[0].orderQty : 0;
      let orderSum = resOrder[0].orderSum != undefined ? resOrder[0].orderSum : 0;
      //调用更新自定义项接口
      let url = "https://www.example.com/";
      let definesInfo = {};
      definesInfo["isHead"] = true;
      definesInfo["isFree"] = true;
      definesInfo["define16"] = resReceiver[i].oriSum;
      definesInfo["define15"] = resReceiver[i].receivedQty;
      definesInfo["define13"] = "未生成"; //是否生成签收凭证：1-未生成，2-已生成
      //订单与签收单的金额数量相等则更新状态为"2-已签收"，否则更新为"1-未签收"
      if (orderQty == receiverQty && orderSum == receiverSum) {
        //引入日期格式化函数
        definesInfo["define14"] = "已签收";
        definesInfo["define12"] = resReceiver[i].qTime;
      } else {
        definesInfo["define14"] = "未签收";
      }
      let body = {
        billnum: "voucher_order",
        datas: [
          {
            id: resReceiver[i].orderId,
            code: resReceiver[i].orderCode,
            definesInfo: [definesInfo]
          }
        ]
      };
      let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });