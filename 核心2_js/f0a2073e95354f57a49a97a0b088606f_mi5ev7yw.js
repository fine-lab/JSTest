let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourcecode = request.code;
    //查询批检验记录审批ISY_2.ISY_2.recordanalysisrecordreview
    let sisrecordSql = "select verifystate from ISY_2.ISY_2.recordanalysisrecordreview where sourcecode = '" + sourcecode + "'";
    let sisrecordRes = ObjectStore.queryByYonQL(sisrecordSql, "sy01");
    //查询批生产记录审批ISY_2.ISY_2.batchManufRecordReview
    let manufRecordSql = "select verifystate from ISY_2.ISY_2.batchManufRecordReview where sourcecode = '" + sourcecode + "'";
    let manufRecordRes = ObjectStore.queryByYonQL(manufRecordSql, "sy01");
    let errMessage = { code: 200, message: "" };
    if (typeof sisrecordRes != "undefined" && sisrecordRes != null) {
      if (sisrecordRes.length > 0) {
        if (sisrecordRes[0].verifystate != "2") {
          errMessage = { code: 201, message: "完工报告对应的批检验记录单没有审核，请检查 \n" };
        }
      } else {
        errMessage = { code: 201, message: "完工报告没有生成批检验记录单，请检查 \n" };
      }
    } else {
      errMessage = { code: 201, message: "完工报告没有生成批检验记录单，请检查 \n" };
    }
    if (typeof manufRecordRes != "undefined" && manufRecordRes != null) {
      if (manufRecordRes.length > 0) {
        if (manufRecordRes[0].verifystate != "2") {
          errMessage = { code: 202, message: "完工报告对应的批生产记录单没有审核，请检查 \n" };
        }
      } else {
        errMessage = { code: 202, message: "完工报告没有生成批生产记录单，请检查 \n" };
      }
    } else {
      errMessage = { code: 202, message: "完工报告没有生成批生产记录单，请检查 \n" };
    }
    return { errMessage };
  }
}
exports({ entryPoint: MyAPIHandler });