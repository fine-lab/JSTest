let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data;
    var list = data[0].changeDetailsDetailsList;
    var flag = data[0].hasOwnProperty("changeDetailsDetailsList");
    if (flag) {
      var sumPrice = 0;
      var id = list[0].changeDetails_id;
      //查询变更明细
      let sqlSon = "select * from GT102917AT3.GT102917AT3.changeDetailsDetails where changeDetails_id='" + id + "'";
      let resSon = ObjectStore.queryByYonQL(sqlSon);
      for (var i = 0; i < resSon.length; i++) {
        if (resSon[i].changeAmount != null) {
          sumPrice = sumPrice + resSon[i].changeAmount;
        }
      }
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = { sumPrice: sumPrice };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.changeDetails", toUpdate, updateWrapper, "9bdc57b7");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });