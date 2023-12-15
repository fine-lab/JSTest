let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //通过付款单id（PayOrderID）查询中间表对应的id
    let sqlpid = "select id from AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults where PayOrderID='" + request.id + "' ";
    let respid = ObjectStore.queryByYonQL(sqlpid);
    //批量更新实体【SAP同步结果查询】中的字段：【是否已同步SAP】【同步SAP结果】
    var object = { id: respid[0].id, isSync: request.isSync, sapSCode: request.TINUM, SAPSyncResult: request.SAPSyncResult, _status: "Update" };
    var res = ObjectStore.updateById("AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults", object, "yb219003a5List");
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });