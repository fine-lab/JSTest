let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //会计期间
    let kuaijiqij = request.huijiqijian;
    //项目
    let project = request.project;
    //部门
    let adminOrgVO = request.adminOrgVO;
    let yscbsql =
      "select IFNULL(service_fee_zx,0)+IFNULL(service_charge_zx,0)+IFNULL(freight_zx,0)+IFNULL(direct_materials_zx,0)+IFNULL(artificial_zx,0)+IFNULL(make_zx,0) AS yscb from GT99994AT1.GT99994AT1.projectbudget_new where dr=0  and sanheyusuanbumenbianma='" +
      adminOrgVO +
      "' and xiangmubianma='" +
      project +
      "' and huijiqijian leftlike '" +
      substring(kuaijiqij, 0, 7) +
      "'";
    var res = ObjectStore.queryByYonQL(yscbsql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });