let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let masterRes = [];
    //查询不合格主表
    let masterSql = "select * from GT22176AT10.GT22176AT10.SY01_bad_drugv7";
    let masRes = ObjectStore.queryByYonQL(masterSql);
    //查询不合格子表
    let childSql = "select * from GT22176AT10.GT22176AT10.SY01_unqualison7";
    let childRes = ObjectStore.queryByYonQL(childSql);
    //查询物料
    let sql = "select * from pc.product.Product";
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    for (let i = 0; i < masterId.length; i++) {
      let mid = masterId[i];
      let remark = "";
      let is_handle = "";
      let dateTime = {};
      let cArr = [];
      for (let j = 0; j < masRes.length; j++) {
        if (masterId[i] != masRes[j].id) {
          continue;
        }
        if (masRes[j].verifystate != 2 || masRes[j].verifystate != "2") {
          throw new Error("含有未审核的单据无法导出");
        }
        dateTime.mid = masRes[j].date;
        remark = masRes[j].remark;
        is_handle = masRes[j].is_handle;
        break;
      }
      for (let k = 0; k < childRes.length; k++) {
        if (masterId[i] != childRes[k].SY01_bad_drugv2_id) {
          continue;
        }
        for (let l = 0; l < productInfo.length; l++) {
          if (childRes[k].product_code != productInfo[l].id) {
            continue;
          }
          childRes[k].standard_code = productInfo[l].extend_standard_code;
          childRes[k].extend_package_specification = productInfo[l].extend_package_specification;
          childRes[k].remark = remark;
          childRes[k].is_handleM = is_handle;
          childRes[k].date = dateTime.mid;
          break;
        }
        cArr.push(childRes[k]);
      }
      masterRes.push(cArr);
    }
    return { masterRes };
  }
}
exports({ entryPoint: MyAPIHandler });