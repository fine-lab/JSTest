let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param1 = request.ids;
    //公共变量定义
    let sql = ""; //待执行的SQL语句
    let url = ""; //待调用接口地址
    let body = ""; //接口调用入参
    //域名升级，世贸生产环境
    let httpURL = "https://c2.yonyoucloud.com"; //域名变量
    sql = "select distinct orderCode,orderId from usp.signconfirmation.SignConfirmations where mainid= '" + param1 + "'";
    let resAu = ObjectStore.queryByYonQL(sql, "uscmpub");
    sql = "select orderId.id,orderId.code as Code,sum(subQty),sum(oriSum) from voucher.order.OrderDetail ";
    //订单有效状态
    sql += " where orderId = '" + resAu[0].orderId + "'";
    let resOrder = ObjectStore.queryByYonQL(sql, "udinghuo");
    let orderQty = resOrder[0].subQty != undefined ? resOrder[0].subQty : 0;
    let orderSum = resOrder[0].oriSum != undefined ? resOrder[0].oriSum : 0;
    //根据订单id查询签收单
    sql = "select orderId,sum(receivedQty),sum(oriSum) from usp.signconfirmation.SignConfirmations ";
    sql += " where mainid.status = 1 ";
    sql += " and orderId = '" + resAu[0].orderId + "'";
    sql += " group by orderId";
    let resReceiver = ObjectStore.queryByYonQL(sql, "uscmpub");
    let receiverQty = resReceiver[0].receivedQty != undefined ? resReceiver[0].receivedQty : 0;
    let receiverSum = resReceiver[0].oriSum != undefined ? resReceiver[0].oriSum : 0;
    //调用更新自定义项接口
    url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
    let definesInfo = {};
    definesInfo["isHead"] = true;
    definesInfo["isFree"] = true;
    definesInfo["define3"] = resReceiver[0].oriSum;
    definesInfo["define4"] = resReceiver[0].receivedQty;
    definesInfo["define5"] = "未生成"; //是否生成签收凭证：1-未生成，2-已生成
    //订单与签收单的金额数量相等则更新状态为"2-已签收"，否则更新为"1-未签收"
    if (orderQty == receiverQty && orderSum == receiverSum) {
      //引入日期格式化函数
      let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
      //当天日期
      let sCurrDate = funFmtDt.execute(new Date());
      definesInfo["define1"] = "已签收";
      definesInfo["define2"] = sCurrDate;
    } else {
      definesInfo["define1"] = "未签收";
    }
    let body2 = {
      billnum: "voucher_order",
      datas: [
        {
          id: resAu[0].orderId,
          code: resOrder[0].Code,
          definesInfo: [definesInfo]
        }
      ]
    };
    let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body2)); //TODO：注意填写应用编码
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });