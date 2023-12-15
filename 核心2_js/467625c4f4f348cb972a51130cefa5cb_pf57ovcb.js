let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //域名变量
    let httpURL = "https://c2.yonyoucloud.com";
    //引入日期格式化函数
    let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
    let sql = "";
    //当天日期
    let dtNow = new Date();
    let sFmtEndDate = funFmtDt.execute(dtNow) + " 23:59:59";
    //当天日期减1天，天*小时*分钟*秒*毫秒
    dtNow.setTime(dtNow.getTime() - 1 * 24 * 60 * 60 * 1000);
    let sFmtStartDate = funFmtDt.execute(dtNow) + " 00:00:00";
    //根据查询条件查询签收单
    sql = "select orderId, max(orderCode) as orderCode, max(mainid.auditTime) as qTime, sum(receivedQty) as receivedQty,sum(oriSum) as oriSum  from usp.signconfirmation.SignConfirmations ";
    sql += " where mainid.status = 1 ";
    sql += " and mainid.auditTime>='" + sFmtStartDate + "'"; // 根据收款单的审批时间（1天以内）去查询
    sql += " group by orderId";
    let resReceiver = ObjectStore.queryByYonQL(sql, "uscmpub");
    for (let i = 0; i < resReceiver.length; i++) {
      sql = "select orderId.id,orderId.code,sum(subQty) as orderQty,sum(oriSum) as orderSum from voucher.order.OrderDetail";
      //订单有效状态
      sql += " where orderId='" + resReceiver[i].orderId + "'";
      let resOrder = ObjectStore.queryByYonQL(sql, "udinghuo");
      //根据订单id查询签收单
      sql = "select orderId, max(orderCode) as orderCode, max(mainid.auditTime) as qTime, sum(receivedQty) as receivedQty,sum(oriSum) as oriSum  from usp.signconfirmation.SignConfirmations ";
      sql += " where orderId ='" + resReceiver[i].orderId + "'";
      let resReceiver2 = ObjectStore.queryByYonQL(sql, "uscmpub");
      let receiverQty = resReceiver2[0].receivedQty != undefined ? resReceiver2[0].receivedQty : 0;
      let receiverSum = resReceiver2[0].oriSum != undefined ? resReceiver2[0].oriSum : 0;
      let orderQty = resOrder[0].orderQty != undefined ? resOrder[0].orderQty : 0;
      let orderSum = resOrder[0].orderSum != undefined ? resOrder[0].orderSum : 0;
      //调用更新自定义项接口
      let url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
      let definesInfo = {};
      definesInfo["isHead"] = true;
      definesInfo["isFree"] = true;
      definesInfo["define16"] = resReceiver2[0].oriSum;
      definesInfo["define15"] = resReceiver2[0].receivedQty;
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
exports({ entryPoint: MyTrigger });