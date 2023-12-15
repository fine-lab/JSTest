let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var BillOfMaterial_id = request.event[0].billOfMaterial;
    var sql = "select * from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where id= '" + BillOfMaterial_id + "'";
    var Type = ObjectStore.queryByYonQL(sql, "developplatform");
    if (Type.length == 0) {
      throw new Error("获取物料类型失败！！！！");
    }
    var body = {};
    body.id = BillOfMaterial_id; //   materialCode[0].id
    body.inspectType = Type[0].inspectType;
    return { body };
  }
}
exports({ entryPoint: MyAPIHandler });