let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询标签记录表
    var paramID = request.id;
    if (paramID != null && "undefined" != paramID) {
      var object = { huoban03_id: paramID };
      var res = ObjectStore.selectByMap("AT189A414C17580004.AT189A414C17580004.label99", object);
      if (res != null && "undefined" != res) {
        var idall = res.map((item) => item.biaoqian);
        //查询标签档案
        //查询内容
        var object = {
          ids: idall
        };
        //实体查询
        var bqres = ObjectStore.selectBatchIds("AT189A414C17580004.AT189A414C17580004.bqdoc", object);
        //获取名称集合
        var names = bqres.map((name) => name.new1);
        return { data: names };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });