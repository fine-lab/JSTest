let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var mainid = request.mainid; //主表主键
    var sign = "已签字"; //签字
    var mealtype = request.data.mealtype; //餐别
    var classlunch = request.data.classlunch; //班中餐
    var popularmeal = request.data.popularmeal; //大众餐
    var esubsidies = request.data.esubsidies; //职工补贴
    var csubsidies = request.data.csubsidies; //客饭补贴
    var incomesum = request.data.incomesum; //收入合计
    var peoplenum = request.data.peoplenum; //人数
    var plain = request.data.plain; //素菜类
    var meatdiet = request.data.meatdiet; //荤菜类
    var noodles = request.data.noodles; //面食类
    var seasoning = request.data.seasoning; //调料类
    var other = request.data.other; //其他类
    var costsum = request.data.costsum; //成本合计
    var balance = request.data.balance; //结余
    var url = "GT21859AT11.GT21859AT11.income_detail1";
    var object = {
      income_detail1Fk: mainid,
      sign: sign,
      mealtype: mealtype,
      classlunch: classlunch,
      popularmeal: popularmeal,
      esubsidies: esubsidies,
      csubsidies: csubsidies,
      incomesum: incomesum,
      peoplenum: peoplenum,
      plain: plain,
      meatdiet: meatdiet,
      noodles: noodles,
      seasoning: seasoning,
      other: other,
      costsum: costsum,
      balance: balance,
      subTable: [{ key: "yourkeyHere" }]
    };
    var res = ObjectStore.insert(url, object, "97597202");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });