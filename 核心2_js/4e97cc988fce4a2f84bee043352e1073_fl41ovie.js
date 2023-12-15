// 流程启动时，统计累计和当前执行
function statics(state) {
  var objList = ObjectStore.queryByYonQL("select * from GT981AT18.GT981AT18.entityA");
  // 整理基于field的Map对象
  var entityAMap = []; //[{key:'yourkeyHere',value:[{},{}]},{key:'yourkeyHere',value:[{},{}]},{key:'yourkeyHere',value:[{},{}]}]
  for (let i = 0; i < objList.length; i++) {
    let field1 = objList[i].field1;
    // 已经存在，添加到列表中
    for (let j = 0; j < entityAMap.length; j++) {
      if (entityAMap.key == field1) {
        entityAMap.value.push(objList[i]);
        break;
      }
    }
    // 不存在，新增到该Map对象中
    var entityCList = [];
    entityCList.push(objList[i]);
    let entityTemp = { key: field1, value: entityCList };
    entityAMap.push(entityTemp);
  }
  //对于每个field，生成entityC
  for (let k = 0; k < entityAMap.length; k++) {
    var entityC = {};
    entityC.field1 = entityAMap[k].key;
    // 累计
    var entityAList = entityAMap[k].value;
    var total = new Big(0); // 累计
    var current = new Big(0); // 当前执行
    var total_complete = new Big(0); // 累计完成
    for (let m = 0; m < entityAList.length; m++) {
      // 累计
      total = total.plus(entityAList[m].field4);
      // 当前执行：单据状态为完成或结束 ？？？
      if (entityAList[m].verifystate == 2 || entityAList[m].verifystate == 3) {
        current = current.plus(entityAList[m].field4);
      }
      // 累计完成
      if (entityAList[m].verifystate == 2) {
        total_complete = total_complete.plus(entityAList[m].field4);
      }
    }
    // 查询该记录是否已经存在，如果存在则更新，否则新增
    var columnMap = { field1: entityC.field1 };
    var result = ObjectStore.selectByMap("GT981AT18.GT981AT18.entityC", columnMap);
    // 流程启动
    if (state === 0) {
      if (result.length > 0) {
        // 存在
        let entityCTemp = result.get(0);
        entityCTemp.total = entityC.total;
        entityCTemp.current = entityC.current;
        ObjectStore.updateById("GT981AT18.GT981AT18.entityC", entityCTemp);
      } else {
        // 新增
        entityC.total = total;
        entityC.current = current;
        ObjectStore.insert("GT981AT18.GT981AT18.entityC", entityC, "e97ed9d3");
      }
    } else {
      // 流程结束或撤回
      if (result.length > 0) {
        // 存在
        let entityCTemp = result[0];
        entityCTemp.total_complete = entityC.total_complete;
        entityCTemp.current = entityC.current;
        ObjectStore.updateById("GT981AT18.GT981AT18.entityC", entityCTemp);
      } else {
        // 新增
        entityC.total = total;
        entityC.total_complete = total_complete;
        ObjectStore.insert("GT981AT18.GT981AT18.entityC", entityC, "e97ed9d3");
      }
    }
  }
}
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    statics(1);
    return { a: 1 };
  }
}
exports({ entryPoint: MyTrigger });