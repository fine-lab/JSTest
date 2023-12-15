let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询所有 否则批量或单查询
    if (request === null) {
      var sqlAll = "select * from GT59181AT30.GT59181AT30.XPH_MQC";
      let queryAll = ObjectStore.queryByYonQL(sqlAll);
      return { result: queryAll };
    } else {
      var names = request.names;
      if (typeof names == "undefined" || names === null) {
        return { error: "请写入name" };
      } else {
        let result = [];
        for (var index in names) {
          var sqlBatch = "select * from GT59181AT30.GT59181AT30.XPH_MQC where name='" + names[index] + "'";
          let batchQuery = ObjectStore.queryByYonQL(sqlBatch);
          if (batchQuery.length === 0 || batchQuery === null) {
            batchQuery = "name:" + names[index] + "无结果";
            result.push(batchQuery);
            continue;
          } else {
            result.push(batchQuery);
          }
        }
        return { result: result };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });