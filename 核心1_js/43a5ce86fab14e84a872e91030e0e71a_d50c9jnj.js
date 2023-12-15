let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let responseObj = { code: "200", message: "更新成功！" };
    if (!data) {
      responseObj = { code: "9991", message: "请检查入参！" };
      return responseObj;
    }
    // 批量更新数据
    let updateObjs = [];
    // 单据类型 1:采购订单
    let inType = data.inType;
    let result = data.result;
    let map = new Map();
    let idArray = [];
    for (let i = 0; i < result.length; i++) {
      let sumQpy = 0;
      let id = result[i].id;
      //操作类型
      let actionType = result[i].actionType;
      //下单数量--数量
      let resQuantity = result[i].resQuantity;
      if (actionType == "S") {
        if (resQuantity) {
          sumQpy = sumQpy + Number(resQuantity);
        }
      } else {
        if (resQuantity) {
          sumQpy = sumQpy - Number(resQuantity);
        }
      }
      map.set(id, sumQpy);
      idArray.push(id);
    }
    let sql = "select id ,orderedQuantity,remainingQuantity from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn where id in ('" + idArray.join("','") + "')";
    let res = ObjectStore.queryByYonQL(sql);
    if (!res || res.length == 0) {
      responseObj = { code: "999", message: "未查询到对应囤货入库数据，请检查！" };
      return responseObj;
    }
    for (let j = 0; j < res.length; j++) {
      let id = res[j].id;
      let sumQpy = map.get(id);
      let updateObj = {};
      let orderedQuantity = res[j].orderedQuantity;
      if (orderedQuantity) {
        updateObj.orderedQuantity = sumQpy + Number(orderedQuantity);
      } else {
        updateObj.orderedQuantity = sumQpy;
      }
      let remainingQuantity = res[j].remainingQuantity;
      if (remainingQuantity) {
        updateObj.remainingQuantity = Number(remainingQuantity) - sumQpy;
      } else {
        updateObj.remainingQuantity = 0 - sumQpy;
      }
      updateObj._status = "Update";
      updateObj.id = id;
      updateObjs.push(updateObj);
    }
    var res1 = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", updateObjs, "yba160dbe1");
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });