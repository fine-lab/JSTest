let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let lowerCode = request.lowerCode;
    let nonConformingDrugsSQL = "select id from GT22176AT10.GT22176AT10.SY01_bad_drugv2 where dr = 0 and sydjh = " + lowerCode; //不合格药品登记
    let qualityReviewSQL = "select id from 	GT22176AT10.GT22176AT10.Sy01_quareview where dr = 0 and upCode = " + lowerCode; //质量复查
    let nonConformingDrugsRest = ObjectStore.queryByYonQL(nonConformingDrugsSQL);
    let qualityReviewRest = ObjectStore.queryByYonQL(qualityReviewSQL);
    let resultBool = false;
    if (nonConformingDrugsRest.length > 0 || qualityReviewRest.length > 0) {
      resultBool = true;
    }
    return { resultBool: resultBool };
  }
}
exports({ entryPoint: MyAPIHandler });