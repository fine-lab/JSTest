let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //判断是否有检测订单单号
    let jcddNo = request.code;
    let rzrq = request.importData;
    let sql = "";
    //检测订单：未删除、自检、检测状态(检测中、已终止)、会计期间
    if (jcddNo) {
      sql =
        "select *,(select id,bomType,billOfMaterial,ImportTeam,DetectOrder_id,dr from BOMImportList ) from AT15F164F008080007.AT15F164F008080007.DetectOrder where dr=0 and code='" +
        jcddNo +
        "' and InspectionForm='01' and checkStatus in('10','30') and  importData leftlike '" +
        substring(rzrq, 0, 7) +
        "'";
    } else {
      sql =
        "select *,(select id,bomType,billOfMaterial,ImportTeam,DetectOrder_id,dr from BOMImportList ) from AT15F164F008080007.AT15F164F008080007.DetectOrder where dr=0 and InspectionForm='01'  and checkStatus in('10','30') and importData leftlike '" +
        substring(rzrq, 0, 7) +
        "'";
    }
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });