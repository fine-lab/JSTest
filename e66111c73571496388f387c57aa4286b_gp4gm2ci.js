let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询领域记录表
    var paramID = request.id;
    if (paramID != null && "undefined" != paramID) {
      var object = { huoban03_id: request.id };
      var res = ObjectStore.selectByMap("AT189A414C17580004.AT189A414C17580004.lynl01", object);
      if (res != null && "undefined" != res) {
        var idall = res.map((item) => item.lingyu);
        //查询领域档案
        //查询内容
        var object = {
          ids: idall
        };
        //实体查询
        var domainres = ObjectStore.selectBatchIds("AT189A414C17580004.AT189A414C17580004.lydoc", object);
        //获取名称集合
        var names = domainres.map((name) => name.new1);
        return { data: names };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });