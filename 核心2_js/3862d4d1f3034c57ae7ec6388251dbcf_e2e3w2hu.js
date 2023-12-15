let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = `select *,id from AT17AA2EFA09C00009.AT17AA2EFA09C00009.coilRegistrationDetails where manufacturing_order_id=${request.parms.id}`; //where  manufacturing_order_id=request.parms
    var res = ObjectStore.queryByYonQL(sql);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", request.parms.id);
    // 待更新字段内容
    var toUpdate = { material_assistUnitCount: request.parms.UnitCount };
    var resa = ObjectStore.update("AT17AA2EFA09C00009.AT17AA2EFA09C00009.coilRegistrationDetails", toUpdate, updateWrapper, "yb3df32ae1");
    return { resa };
  }
}
exports({ entryPoint: MyAPIHandler });