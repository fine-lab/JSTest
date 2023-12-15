let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let responseObj = { code: "200", message: "更新成功！" };
    if (!data || data.length == 0) {
      responseObj.code = "999";
      responseObj.message = "入参data为空！请检查！";
      return responseObj;
    }
    if (data.length > 100) {
      responseObj.code = "999";
      responseObj.message = "入参data长度超过100！请分多次更新！";
      return responseObj;
    }
    let taskDirectiveIds = [];
    data.forEach((item) => {
      if (!item.taskDirectiveId || !item.outboundQty || !item.outboundTime || !item.batchNumber) {
        responseObj.code = "999";
        responseObj.message = "入参taskDirectiveId、outboundQty、outboundTime、batchNumber必填！请检查！";
        return responseObj;
      }
      taskDirectiveIds.push(item.taskDirectiveId);
    });
    let outSql = "select id,taskDirectiveId,itemCode,outboundQty from AT181E613C1770000A.AT181E613C1770000A.ReservoirOut ";
    outSql += " where taskDirectiveId in ('" + taskDirectiveIds.join("','") + "')";
    let outRes = ObjectStore.queryByYonQL(outSql);
    if (!outRes || outRes.length == 0) {
      return responseObj;
    }
    // 组装对象，更新囤货出库数据
    let updateObjs = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < outRes.length; j++) {
        if (outRes[j].taskDirectiveId == data[i].taskDirectiveId) {
          let updateObj = {};
          updateObj.id = outRes[j].id;
          data[i].id = outRes[j].id;
          updateObj.ReservoirOutDetailList = [
            { outCount: Number(data[i].outboundQty), outDate: data[i].outboundTime, batchNumber: data[i].batchNumber, outType: "4", dataStatus: "2", _status: "Insert" }
          ];
          if (!outRes[j].outboundQty) {
            outRes[j].outboundQty = 0;
          }
          updateObj.outboundQty = Number(outRes[j].outboundQty) + Number(data[i].outboundQty);
          updateObjs.push(updateObj);
          break;
        }
      }
      if (!data[i].id) {
        responseObj.code = "999";
        responseObj.message = "入参taskDirectiveId=" + data[i].taskDirectiveId + "不存在！请检查！";
        return responseObj;
      }
    }
    var res = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirOut", updateObjs, "yb97e9b3a5");
    return responseObj;
  }
}
exports({ entryPoint: MyAPIHandler });