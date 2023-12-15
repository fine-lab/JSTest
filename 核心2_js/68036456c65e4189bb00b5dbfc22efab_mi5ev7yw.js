//获取原厂物料创建（物料档案）： 1、物料的检验属性是检验； 2、根据检验结果入库是“是”； 的所有数据
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let materialId = request.materialId;
    let proMasterSql = "select * from pc.product.Product where id =" + materialId;
    let proMasterRes = ObjectStore.queryByYonQL(proMasterSql, "productcenter");
    if (typeof proMasterRes != "undefined" && proMasterRes != null) {
      if (proMasterRes.length > 0) {
        //查询主计量
        let unitSql = "select * from pc.unit.Unit where id =" + proMasterRes[0].unit;
        let unitRes = ObjectStore.queryByYonQL(unitSql, "productcenter");
        proMasterRes[0].unit_name = unitRes[0].name;
      }
    }
    return { proMasterRes };
  }
}
exports({ entryPoint: MyAPIHandler });