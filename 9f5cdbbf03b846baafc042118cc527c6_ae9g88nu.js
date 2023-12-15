let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let udiId = request.udiId;
    //查 数据中 di 这里是唯一一条,用于查出di 找到多条关联数据
    let resDataFileSql = "select * from GT22176AT10.GT22176AT10.UDIFile where parentUdiId = '" + udiId + "'";
    let resUDIDataFileRs = ObjectStore.queryByYonQL(resDataFileSql, "sy01");
    return { resUDIDataFileRs };
  }
}
exports({ entryPoint: MyAPIHandler });