let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //通过付款单据编号（code）查询中间表对应的id
    let sqlpid = "select id from AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults where code='" + request.ysCode + "' ";
    let respid = ObjectStore.queryByYonQL(sqlpid);
    //批量更新实体【SAP同步结果查询】中的字段：【支付状态】【SAP请款单号】【SAP支付时间】
    var object = { id: respid[0].id, paymentstatus: "1", SAPorderCode: request.sapCode, SAPpaytime: request.sapTime, _status: "Update" };
    var res = ObjectStore.updateById("AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults", object, "yb219003a5List");
    return { code: 200 };
  }
}
exports({ entryPoint: MyAPIHandler });