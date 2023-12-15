let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询产品记录表
    var paramID = request.id;
    if (paramID != null && "undefined" != paramID) {
      var object = { huoban03_id: request.id };
      var res = ObjectStore.selectByMap("AT189A414C17580004.AT189A414C17580004.cpnl01", object);
      if (res != null && "undefined" != res) {
        var idall = res.map((item) => item.chanpin);
        //查询产品档案
        //查询内容
        var object = {
          ids: idall
        };
        //实体查询
        var productres = ObjectStore.selectBatchIds("AT189A414C17580004.AT189A414C17580004.cpdoc", object);
        //获取名称集合
        var names = productres.map((name) => name.mingchen);
        return { data: names };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });