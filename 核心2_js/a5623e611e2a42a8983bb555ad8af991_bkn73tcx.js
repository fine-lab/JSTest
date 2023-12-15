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
    let resCbgj = ObjectStore.queryByYonQL(sql);
    let responseData = []; // 所有主子表数据
    if (resCbgj != undefined) {
      if (resCbgj.length > 0) {
        for (let i = 0; i < resCbgj.length; i++) {
          let id = resCbgj[i].id;
          // 合同资产与合同负债子表信息
          let sqlHtzc = "select * from GT62395AT3.GT62395AT3.htzcyhtfznew where cbgjnew_id = '" + id + "'";
          let resHtzc = ObjectStore.queryByYonQL(sqlHtzc);
          let cbgj = resCbgj[i];
          cbgj.htzcyhtfznew = resHtzc;
          responseData.push(cbgj);
        }
      }
    }
    return { responseData };
  }
}
exports({ entryPoint: MyAPIHandler });