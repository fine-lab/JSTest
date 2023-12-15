let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 复核不合格数量+累计质量复查不合格数量-累计不合格登记数量>0 才可以下推
    // 不合格品登记单默认数量=复核不合格数量+累计质量复查不合格数量-累计不合格数量；
    var checkUnqualifiedNum = 0;
    var totalQualityUnQualifiedNum = 0;
    var totalUnqualifiedNum = 0;
    var id = request.id;
    var thisSql = "select checkUnqualifiedNum,totalQualityUnQualifiedNum,totalUnqualifiedNum from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6 where sy01_saleoutstofhv5_id= '" + id + "'";
    var billDetails = ObjectStore.queryByYonQL(thisSql);
    if (billDetails[0].checkUnqualifiedNum != undefined) {
      checkUnqualifiedNum = billDetails[0].checkUnqualifiedNum;
    }
    if (billDetails[0].totalQualityUnQualifiedNum != undefined) {
      totalQualityUnQualifiedNum = billDetails[0].totalQualityUnQualifiedNum;
    }
    if (billDetails[0].totalUnqualifiedNum != undefined) {
      totalUnqualifiedNum = billDetails[0].totalUnqualifiedNum;
    }
    var resultNumb = checkUnqualifiedNum + totalQualityUnQualifiedNum - totalUnqualifiedNum;
    return { resultNumb };
  }
}
exports({ entryPoint: MyAPIHandler });