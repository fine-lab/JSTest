let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data;
    var list = data[0].additionalConditionDetailsList; //additionalConditionDetailsList    additionalConditionDetailsList   additionalStatementDetailsList
    if (list == null) {
      list = data[0].additionalStatementDetailsList;
    }
    if (list != null) {
      var sumPrice = 0;
      var id = list[0].additionalDetails_id;
      //查询附加合同明细
      let sqlSon = "select * from GT102917AT3.GT102917AT3.additionalConditionDetails where additionalDetails_id='" + id + "'";
      let resSon = ObjectStore.queryByYonQL(sqlSon);
      if (resSon.length > 0) {
        for (var i = 0; i < resSon.length; i++) {
          if (resSon[i].additionAmount != null) {
            sumPrice = sumPrice + resSon[i].additionAmount;
          }
        }
      }
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = { sumPrice: sumPrice };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.additionalDetails", toUpdate, updateWrapper, "9f97eac2");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });