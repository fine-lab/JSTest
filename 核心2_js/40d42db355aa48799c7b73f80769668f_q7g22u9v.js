let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询所有 否则批量或单查询
    if (request) {
      var sqlAll = "select * from GT59181AT30.GT59181AT30.XPH_MQCType";
      let queryAll = ObjectStore.queryByYonQL(sqlAll);
      return { result: queryAll };
    } else {
      var codes = request.codes;
      if (typeof codes == "undefined" || codes === null) {
        return { error: "请写入code" };
      } else {
        let result = [];
        for (var index in codes) {
          var sqlBatch = "select * from GT59181AT30.GT59181AT30.XPH_MQCType where code='" + codes[index] + "'";
          let batchQuery = ObjectStore.queryByYonQL(sqlBatch);
          if (batchQuery.length === 0 || batchQuery === null) {
            batchQuery = "code:" + codes[index] + "无结果";
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