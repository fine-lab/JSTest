let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let date = request.qianshouri;
    let projectCode = request.hth != undefined ? request.hth : undefined;
    let dept = request.dept != undefined ? request.dept : undefined;
    // 查询主表信息：
    let sql = "";
    if (projectCode != undefined) {
      if (dept != undefined) {
        sql =
          "select *," +
          " (select * from fwcbnewList) fwcbnewList," +
          " (select * from zjclnewList) zjclnewList," +
          " (select * from cbjznewList) cbjznewList," +
          " (select * from hjcbnewList) hjcbnewList," +
          " (select * from zzfynewList) zzfynewList," +
          " (select * from rgcbnewList) rgcbnewList," +
          " (select * from htzcyhtfznewList) htzcyhtfznew," +
          " (select * from lwcbnewList) lwcbnewList," +
          " (select * from bgjenewList) bgjenewList," +
          " (select * from yscbnewList) yscbnewList" +
          " from GT62395AT3.GT62395AT3.cbgjnew where dr=0 and dept = '" +
          dept +
          "' and projectCode = '" +
          projectCode +
          "' and huijiqijian leftlike '" +
          substring(date, 0, 7) +
          "'";
      } else {
        sql =
          "select *," +
          " (select * from fwcbnewList) fwcbnewList," +
          " (select * from zjclnewList) zjclnewList," +
          " (select * from cbjznewList) cbjznewList," +
          " (select * from hjcbnewList) hjcbnewList," +
          " (select * from zzfynewList) zzfynewList," +
          " (select * from rgcbnewList) rgcbnewList," +
          " (select * from htzcyhtfznewList) htzcyhtfznew," +
          " (select * from lwcbnewList) lwcbnewList," +
          " (select * from bgjenewList) bgjenewList," +
          " (select * from yscbnewList) yscbnewList" +
          " from GT62395AT3.GT62395AT3.cbgjnew where dr=0 and projectCode = '" +
          projectCode +
          "' and huijiqijian leftlike '" +
          substring(date, 0, 7) +
          "'";
      }
    } else {
      if (dept == undefined) {
        sql =
          "select * ," +
          " (select * from fwcbnewList) fwcbnewList," +
          " (select * from zjclnewList) zjclnewList," +
          " (select * from cbjznewList) cbjznewList," +
          " (select * from hjcbnewList) hjcbnewList," +
          " (select * from zzfynewList) zzfynewList," +
          " (select * from rgcbnewList) rgcbnewList," +
          " (select * from htzcyhtfznewList) htzcyhtfznew," +
          " (select * from lwcbnewList) lwcbnewList," +
          " (select * from bgjenewList) bgjenewList," +
          " (select * from yscbnewList) yscbnewList" +
          " from GT62395AT3.GT62395AT3.cbgjnew where dr=0 and shDeptCode != 'DZB' and huijiqijian leftlike '" +
          substring(date, 0, 7) +
          "'";
      } else {
        sql =
          "select * ," +
          " (select * from fwcbnewList) fwcbnewList," +
          " (select * from zjclnewList) zjclnewList," +
          " (select * from cbjznewList) cbjznewList," +
          " (select * from hjcbnewList) hjcbnewList," +
          " (select * from zzfynewList) zzfynewList," +
          " (select * from rgcbnewList) rgcbnewList," +
          " (select * from htzcyhtfznewList) htzcyhtfznew," +
          " (select * from lwcbnewList) lwcbnewList," +
          " (select * from bgjenewList) bgjenewList," +
          " (select * from yscbnewList) yscbnewList" +
          " from GT62395AT3.GT62395AT3.cbgjnew where dr=0 and shDeptCode != 'DZB' and dept = '" +
          dept +
          "' and huijiqijian leftlike '" +
          substring(date, 0, 7) +
          "'";
      }
    }
    let res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });