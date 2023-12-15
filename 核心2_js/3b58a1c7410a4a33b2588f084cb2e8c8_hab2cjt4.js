let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //此函数用来删除自建实体中的数据
    let objectUrl = "GT43053AT3.GT43053AT3.multDimDeduTypeV1_2";
    let objectFormCode = "fe940bb1";
    //查找所有id数据,对查询到的ID数据进行逐个删除
    let selectSql = "select id from GT43053AT3.GT43053AT3.multDimDeduTypeV1_2";
    let ids = ObjectStore.queryByYonQL(selectSql);
    let idCount = ids.length;
    let count = 0;
    let startFlag = Math.round(Math.random() * idCount);
    for (var i = startFlag; i < ids.length; i++) {
      var delContions = { id: ids[i].id };
      var res = ObjectStore.deleteByMap(objectUrl, delContions, objectFormCode);
      delContions = undefined;
      res = undefined;
    }
    var object = {
      logType: "自主巡检定时任务",
      mes5: "删除任务成功执行"
    };
    var res = ObjectStore.insert("GT43053AT3.GT43053AT3.selfLogV1_2", object, "501280b5");
    return { MES: "成功执行！" };
  }
}
exports({ entryPoint: MyTrigger });