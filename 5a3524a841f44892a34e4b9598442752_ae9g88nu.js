let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //传入表名 GT22176AT10.GT22176AT10.UDITrack
    let sqlTableInfo = request.sqlTableInfo; //from后面的语句
    let sqlCg = request.sqlCg; //哪个库
    let rsEntity = request.rsEntity; //需要返回的字段
    if (rsEntity === "" || rsEntity === null || typeof rsEntity === "undefined") {
      rsEntity = "*";
    }
    //查 数据中 di 这里是唯一一条,用于查出di 找到多条关联数据
    let resDataSql = "select " + rsEntity + " from " + sqlTableInfo;
    let resDataRs = ObjectStore.queryByYonQL(resDataSql, sqlCg);
    if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
      resDataRs = [];
      return { resDataRs };
    }
    return { resDataRs };
  }
}
exports({ entryPoint: MyAPIHandler });