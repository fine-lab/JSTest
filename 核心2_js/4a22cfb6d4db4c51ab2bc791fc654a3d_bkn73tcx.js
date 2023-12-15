let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let huijiqijian = request.huijiqijian; // 会计期间
    let xiangmubianma = request.xiangmubianma != undefined ? request.xiangmubianma : undefined; // 项目编码
    let bumen = request.bumen != undefined ? request.bumen : undefined; // 部门
    // 查询主子表信息：
    let sql = "";
    if (xiangmubianma != undefined) {
      sql =
        "select *," +
        " (select * from hjcbList) hjcbList," + // 合计成本子表List
        " (select * from zjclList) zjclList," + // 直接材料子表List
        " (select * from fwList) fwList," + // 服务子表List
        " (select * from ysList) ysList," + // 运输子表List
        " (select * from lwList) lwList" + // 劳务子表List
        " from 	GT62395AT3.GT62395AT3.bcpjz where dr=0 and xiangmumingchen = '" +
        xiangmubianma +
        "' and bumen ='" +
        bumen +
        "' and huijiqijian leftlike '" +
        substring(huijiqijian, 0, 7) +
        "'";
    } else {
      sql =
        "select * ," +
        " (select * from hjcbList) hjcbList," + // 合计成本子表List
        " (select * from zjclList) zjclList," + // 直接材料子表List
        " (select * from fwList) fwList," + // 服务子表List
        " (select * from ysList) ysList," + // 运输子表List
        " (select * from lwList) lwList" + // 劳务子表List
        " from 	GT62395AT3.GT62395AT3.bcpjz where dr=0 and huijiqijian leftlike '" +
        substring(huijiqijian, 0, 7) +
        "'";
    }
    let responseData = ObjectStore.queryByYonQL(sql, "developplatform");
    return { responseData };
  }
}
exports({ entryPoint: MyAPIHandler });