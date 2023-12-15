//本函数默认为 应税外加计算方式
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var allHsje = request.allHsje; //该商品在该促销组的总含税金额
    var hsje = request.hsje; //含税金额
    var sl = request.sl * 0.01; //税率
    var num = request.num; //数量
    var allNum = request.allNum; //该商品在该促销组的数量
    var jd = request.jd; //精度
    var numJd = request.numJd; //数量精度
    var money = {};
    if (allHsje != null && allNum != null) {
      //计算含税单价
      money.hsdj = MoneyFormatReturnBd(allHsje / allNum, numJd);
      //计算含税金额
      hsje = money.hsdj * num;
    }
    //计算税额  含税金额/(1+税率)*税率
    money.se = MoneyFormatReturnBd((hsje / (1 + sl)) * sl, jd);
    //计算无税金额 含税金额-税额
    money.wsje = hsje - money.se;
    //计算无税单价 无税金额/数量
    money.wsdj = MoneyFormatReturnBd(money.wsje / num, numJd);
    //计算含税单价 含税金额/数量
    if (money.hsdj == null) {
      money.hsdj = MoneyFormatReturnBd(hsje / num, numJd);
    }
    //含税金额
    money.hsje = hsje;
    //税率
    money.sl = sl;
    //数量
    money.num = num;
    //金额精度
    money.jd = jd;
    //数量精度
    money.numJd = numJd;
    return money;
  }
}
exports({ entryPoint: MyAPIHandler });