let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let finishedReportId = request.finishedReportId;
    let childId = request.childId;
    let prodCode = request.prodId;
    let batchNo = request.batchNo;
    let lineNo = request.lineNo;
    //查询完工报告主表
    let finishSql = "select * from po.finishedreport.FinishedReport where id = '" + finishedReportId + "'";
    let finishRes = ObjectStore.queryByYonQL(finishSql, "productionorder");
    //查询产品检验单主表
    let proInspApplMSql =
      "select * from QMSQIT.incominspectorder.qms_qit_incominspectorder_h where vsourcecode = '" +
      finishRes[0].code +
      "' and sourcerowno = '" +
      lineNo +
      "' and pk_material = '" +
      prodCode +
      "' and pk_batchcode = '" +
      batchNo +
      "' and pk_sourcebill_b = '" +
      childId +
      "'";
    let proInspApplMRes = ObjectStore.queryByYonQL(proInspApplMSql, "QMS-QIT");
    return { proInspApplMRes: proInspApplMRes }; //"proInspApplRes": proInspApplRes,
  }
}
exports({ entryPoint: MyAPIHandler });