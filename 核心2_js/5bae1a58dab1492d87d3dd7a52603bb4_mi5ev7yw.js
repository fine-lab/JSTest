let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let batchNo = request.batchNo;
    let prodCode = request.prodCode;
    let result = {};
    let r = [];
    //查询入库验收子表数据
    const sql = "select qualityReport from ISY_2.ISY_2.quality_inspection_report where dr = 0 and  product = '" + prodCode + "' and  batch = '" + batchNo + "'";
    let res = ObjectStore.queryByYonQL(sql, "sy01");
    if (typeof res != "undefined" && res != null) {
      if (Array.isArray(res)) {
        if (res.length > 0) {
          result.qualityReport = res[0].qualityReport;
          const sql_product = "select name,code from pc.product.Product where id ='" + prodCode + "'";
          let res_p = ObjectStore.queryByYonQL(sql_product, "productcenter");
          result.productName = res_p[0].name;
          result.productCode = res_p[0].code;
        }
      }
    }
    r[0] = result;
    return { mainRes: r };
  }
}
exports({ entryPoint: MyAPIHandler });