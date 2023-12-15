let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询所有的资质申请单
    var res = ObjectStore.queryByYonQL("select id from GT18952AT11.GT18952AT11.HBZZSQ");
    //逐条删除资质申请单
    for (var i = 0; i < res.length; i++) {
      var object = { id: res[i].id };
      var res1 = ObjectStore.deleteById("GT18952AT11.GT18952AT11.HBZZSQ", object);
      var res2 = "";
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });