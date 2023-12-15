let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取参数 SN
    var sn = "";
    //根据sn 获取数据库中是否有相同数据
    var yonsql = "select * from fa.fixedasset.FixedAssetsInfo ";
    var res = ObjectStore.queryByYonQL(yonsql);
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });