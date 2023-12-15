let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let childId = request.childId;
    //查询来料检验单主表
    let proInspApplMSql = "select * from QMSQIT.incominspectorder.qms_qit_incominspectorder_h where pk_sourcebill_b = '" + childId + "'";
    let proInspApplMRes = ObjectStore.queryByYonQL(proInspApplMSql, "QMS-QIT");
    return { proInspApplMRes: proInspApplMRes };
  }
}
exports({ entryPoint: MyAPIHandler });