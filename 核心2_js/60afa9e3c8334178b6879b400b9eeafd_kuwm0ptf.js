let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 编写详情的查询SQL
    var managerSql = "select goodName,quantity,specification,price," + "money from GT54233AT60.GT54233AT60.purchaseStock where id ='" + request.id + "'";
    var res = ObjectStore.queryByYonQL(managerSql);
    return {
      res: res
    };
  }
}
exports({ entryPoint: MyTrigger });