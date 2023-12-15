let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let date = request.huijiqijian;
    let projectCode = request.projectCode != undefined ? request.projectCode : undefined;
    // 查询主表信息：
    let sql = "";
    if (projectCode != undefined) {
      sql = "select * from GT62395AT3.GT62395AT3.cbgjnew where huijiqijian = '" + date + "' and projectCode = '" + projectCode + "'";
    } else {
      sql = "select * from GT62395AT3.GT62395AT3.cbgjnew where huijiqijian = '" + date + "'";
    }
    let resCbgjZb = ObjectStore.queryByYonQL(sql);
    return { resCbgjZb };
  }
}
exports({ entryPoint: MyAPIHandler });