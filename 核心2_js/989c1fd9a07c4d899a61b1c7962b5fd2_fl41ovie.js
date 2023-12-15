// 环节1和环节2审批完成时，推数据
function stream(step) {
  var objList = ObjectStore.queryByYonQL("select * from GT981AT18.GT981AT18.entityA");
  var entityBList = [];
  for (let i = 0; i < objList.length; i++) {
    var entityB = {};
    entityB.field1 = objList[i].field1;
    entityB.step = step;
    entityB.field4 = objList[i].field4;
    entityBList.push(entityB);
  }
  var result = ObjectStore.insertBatch("GT981AT18.GT981AT18.entityB", entityBList, "af658383List");
  console.info("insert success");
}
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    stream("环节1");
    return { a: 1 };
  }
}
exports({ entryPoint: MyTrigger });