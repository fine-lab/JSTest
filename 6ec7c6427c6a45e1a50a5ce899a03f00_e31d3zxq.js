let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let masterIds = param.data;
    let object = {};
    let arr = [];
    for (let i = 0; i < masterIds.length; i++) {
      object = { id: masterIds[i].source_id, isFrmLoss: "0" };
      arr.push(object);
    }
    //更新不合格主表报损状态字段
    var data = arr;
    var res = ObjectStore.updateBatch("GT22176AT10.GT22176AT10.SY01_bad_drugv7", data, "3837a6e9");
    return {};
    return {};
  }
}
exports({ entryPoint: MyTrigger });