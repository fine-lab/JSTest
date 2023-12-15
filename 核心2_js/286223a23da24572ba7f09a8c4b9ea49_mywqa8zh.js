let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let projectVO = request.projectVO;
    var sql = "select id from GT8660AT38.GT8660AT38.Item_material_relation_table where projectVO = " + projectVO;
    var returnProjectVO = ObjectStore.queryByYonQL(sql);
    let returnif = "true";
    if (returnProjectVO.length == 0) {
      returnif = "false";
      return { returnif };
    }
    if (returnProjectVO[0].id == id) {
      returnif = "false";
      return { returnif };
    }
    return { returnif };
    //返回false表示数据不重复,true表示数据重复
  }
}
exports({ entryPoint: MyAPIHandler });