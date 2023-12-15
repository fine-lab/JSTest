let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let date = request.huijiqijian;
    let projectCode = request.projectCode != undefined ? request.projectCode : undefined;
    let dept = request.dept != undefined ? request.dept : undefined;
    // 查询主表信息：
    let sql = "";
    if (projectCode != undefined) {
      if (dept != undefined) {
        sql = "select * from GT62395AT3.GT62395AT3.cbgjnew where huijiqijian = '" + date + "' and dept = '" + dept + "' and projectCode = '" + projectCode + "'";
      } else {
        sql = "select * from GT62395AT3.GT62395AT3.cbgjnew where huijiqijian = '" + date + "' and projectCode = '" + projectCode + "'";
      }
    } else {
      if (dept != undefined) {
        sql = "select * from GT62395AT3.GT62395AT3.cbgjnew where huijiqijian = '" + date + "' and dept = '" + dept + "'";
      } else {
        sql = "select * from GT62395AT3.GT62395AT3.cbgjnew where huijiqijian = '" + date + "'";
      }
    }
    let responseData = []; // 所有符合条件的合同资产与合同负债数据
    let resCbgj = ObjectStore.queryByYonQL(sql);
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