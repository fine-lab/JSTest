let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //此函数用来删除自建实体中的数据
    let objectUrl = "GT43053AT3.GT43053AT3.riskPotCheckV1_4";
    let objectFormCode = "330f5eb7";
    //查找所有id数据,对查询到的ID数据进行逐个删除
    let selectSql = "select verifystate,id from GT43053AT3.GT43053AT3.riskPotCheckV1_4";
    let verifystates = ObjectStore.queryByYonQL(selectSql);
    //根据id更新单据状态
    var updateBatch = [];
    for (let i = 0; i < verifystates.length; i++) {
      updateBatch.push({
        id: verifystates[i].id,
        verifystate: 0
      });
    }
    var object = {
      logType: "自主巡检定时任务",
      mes5: JSON.stringify(updateBatch)
    };
    var res0 = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLogV1_2", object, "501280b5");
    var res = ObjectStore.updateBatch(objectUrl, updateBatch, objectFormCode);
    return { Mes: "成功执行！" };
  }
}
exports({ entryPoint: MyAPIHandler });