let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let responseObj = { code: "200", message: "更新成功！" };
    //日期
    let date = request.date;
    //长度
    let len = request.len;
    //操作类型 insert update
    let type = request.type;
    let id = request.id;
    let detail = {};
    let updateObjs = [];
    detail.batchDate = date;
    detail.batchCode = len;
    if (type == "1") {
      //插入
      detail._status = "Insert";
      updateObjs.push(detail);
      ObjectStore.insertBatch("AT181E613C1770000A.AT181E613C1770000A.purInBatchNo", updateObjs, "yb3635c8bc");
    } else {
      detail.id = id;
      //更新
      detail._status = "Update";
      updateObjs.push(detail);
      var res = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.purInBatchNo", updateObjs, "yb3635c8bc");
    }
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });