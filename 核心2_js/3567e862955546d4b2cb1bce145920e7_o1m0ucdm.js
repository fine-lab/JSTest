let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //目前只考虑审核通过的情况
    let object = {
      billno: request.billno,
      shifushenpitongguo: "是",
      shenpiren: "/",
      jine: request.taxMoney,
      niandu: request.define19,
      planid: request.define23
    };
    var x = ObjectStore.insert("AT15E7378809680006.AT15E7378809680006.sptgjl", object, "e6604f63");
    //并根据条件更新年度采购计划
    let sql = "select * from AT15E7378809680006.AT15E7378809680006.cgndjh where id = '" + request.define23 + "'";
    let res = ObjectStore.queryByYonQL(sql);
    //价税合计为null的话不执行操作
    if (res.length != 0 && request.taxMoney != null) {
      //默认取第一条数据
      let yymoneyvalue = 0;
      if (res[0].yymoney == null || res[0].yymoney == 0) {
        yymoneyvalue = request.taxMoney;
      } else {
        let x = new Big(res[0].yymoney);
        yymoneyvalue = x.plus(request.taxMoney);
      }
      let oddmoneyvalue = 0;
      if (res[0].oddmoney == null || res[0].oddmoney == 0) {
        let x = new Big(res[0].planmoney);
        oddmoneyvalue = x.minus(request.taxMoney);
      } else {
        let x = new Big(res[0].oddmoney);
        oddmoneyvalue = x.minus(request.taxMoney);
      }
      var object2 = { id: res[0].id, yymoney: yymoneyvalue, oddmoney: oddmoneyvalue };
      var updateres = ObjectStore.updateById("AT15E7378809680006.AT15E7378809680006.cgndjh", object2, "eca4c465");
    }
    return { x };
  }
}
exports({ entryPoint: MyAPIHandler });