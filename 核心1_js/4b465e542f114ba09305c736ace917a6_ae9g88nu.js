let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let str = "";
    for (let key in request.rows) {
      let row = request.rows[key];
      //查询所有主表
      let yonql = "select id,code from GT22176AT10.GT22176AT10.SY01_commodity_plan";
      let main = ObjectStore.queryByYonQL(yonql, "sy01");
      let yonql2 =
        "select commodity_code,batch_code,glzkyhsl,SY01_commodity_plan_id from GT22176AT10.GT22176AT10.SY01_commodity_info where commodity_code = '" +
        row.material_id +
        "' and batch_code = '" +
        row.batch +
        "'";
      let sub = ObjectStore.queryByYonQL(yonql2, "sy01");
      for (let i = 0; i < main.length; i++) {
        for (let j = 0; j < sub.length; j++) {
          if (main[i].id == sub[j].SY01_commodity_plan_id) {
            if (sub[j].glzkyhsl == 0 || sub[j].glzkyhsl == undefined) {
              str += "第" + row.index + "行," + "物料【" + row.material_name + "】有养护计划但未养护完成,养护单号:" + main[i].code + "\n";
            }
          }
        }
      }
    }
    return { str: str };
  }
}
exports({ entryPoint: MyAPIHandler });