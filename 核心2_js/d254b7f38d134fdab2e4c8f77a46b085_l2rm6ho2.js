let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询当前客户是否是特例客户
    var custRes = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MinMoneyControl where mmExceptCustomer = '" + request.customer + "' order by pubts desc ");
    if (custRes.length > 0) {
      var limitMoney = parseFloat(custRes[0].minOrderAmount);
      if (request.totalMoney > limitMoney) {
        return { limitMoneyMsg: custRes[0], limit: true };
      } else {
        return { message: "当前客户最低金额控制：" + limitMoney, limit: false };
      }
    }
    //非特例客户，同时设置是、否地址判断收货地址时，以第一条数据为准
    var limit = true;
    var message = "";
    for (var prop in request) {
      if (prop == "totalMoney" || prop == "customer") {
        continue;
      }
      //判断当前不区分地址
      var limitRes = ObjectStore.queryByYonQL(
        "select * from GT4691AT1.GT4691AT1.MinMoneyControl where  mmBreedingTeam ='" +
          request[prop].fdBreedTeam +
          "' and mmTransWay='" +
          request[prop].fdDispatchName +
          "' and mmCusClassification='" +
          request[prop].fmCustCategory +
          "' order by pubts desc  "
      );
      if (limitRes.length > 0) {
        var limitMoney = parseFloat(limitRes[0].minOrderAmount);
        if (limitRes.bJudgeLocationFit == "1") {
          if (request[prop].totalMoney < limitMoney) {
            message += "【" + prop + "】不满足最低金额（" + limitMoney + "）控制<br/>";
            limit = false;
          }
        } else {
          for (var j in request[prop]) {
            if (j == "totalMoney" || j == "fmLegalEntity" || j == "fdBreedTeam" || j == "fdDispatchName" || j == "fmCustCategory") {
              continue;
            }
            if (request[prop][j] < limitMoney) {
              message += "【" + prop + "&" + j + "】不满足最低金额（" + limitMoney + "）控制<br/>";
              limit = false;
              break;
            }
          }
        }
      }
      //如何当前不符合条件直接
    }
    return { limitMoneyMsg: request[prop], limit: limit, message: message };
  }
}
exports({ entryPoint: MyAPIHandler });