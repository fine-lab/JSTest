let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询会员等级对应的返现比例
    var sql3 = "select * from GT48292AT3.GT48292AT3.CashBackRate";
    sql3 += " where Memberlevel = '" + request.levelId + "'";
    var levelRate = ObjectStore.queryByYonQL(sql3); //数据查询
    if (!levelRate || !levelRate[0]) {
      return {
        code: -1,
        message: "没有找到会员对应返现比例，请联系管理员，在会员返现比例节点进行维护"
      };
    }
    //获取返现比例
    var rate = levelRate[0].rate;
    var value = rate * request.money;
    var backMoney = MoneyFormatReturnBd(value, 2);
    //获取token
    //如果金额为0则不充值
    if (backMoney == 0) {
      result = {
        code: 200
      };
      return {
        message: "该会员无需返现",
        backMoney: 0,
        rechargeResponse: JSON.stringify(result)
      };
    }
    //调用钱包充值
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    //配置参数
    var body = {
      mid: request.mid,
      archiveId: "yourIdHere",
      sum: backMoney,
      settleSum: 0,
      discount: backMoney,
      actionTypes: 1,
      isExternalDiscount: 1,
      voucherCode: "001",
      source1: "x0001",
      paymentWay: 1000
    };
    if (backMoney < 0) {
      body.actionTypes = 4;
      body.paymentWay = 101;
    }
    // 请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + request.token), JSON.stringify(header), JSON.stringify(body));
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    var message = "成功";
    var result;
    if (code != "200") {
      message = "返现充值调用失败";
    }
    result = {
      message: message,
      rechargeResponse: apiResponse,
      request: request,
      backMoney: backMoney
    };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });