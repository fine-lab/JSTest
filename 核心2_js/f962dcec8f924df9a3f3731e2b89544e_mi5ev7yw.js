let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let masterRes = [];
    let str_masterIds = masterId.join(",");
    //查询不合格主表
    let masterSql = "select * from GT22176AT10.GT22176AT10.SY01_bad_drugv7 where id in (" + str_masterIds + ")";
    let masRes = ObjectStore.queryByYonQL(masterSql, "sy01");
    let masIds = [];
    let masObj = [];
    if (masRes.length > 0) {
      for (let i = 0; i < masRes.length; i++) {
        masIds.push(masRes[i].id);
        masObj[masRes[i].id] = masRes[i];
      }
    }
    let str_masIds = masIds.join(",");
    //查询不合格子表
    let childSql = "select * from GT22176AT10.GT22176AT10.SY01_unqualison7 where SY01_bad_drugv2_id in (" + str_masIds + ")";
    let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
    let productIds = [];
    let childArr = [];
    let childObj = {};
    if (childRes.length > 0) {
      for (let i = 0; i < childRes.length; i++) {
        productIds.push(childRes[i].product_code);
        childRes[i] = childRes[i];
        childArr.push(childObj);
      }
    }
    let str_productIds = productIds.join(",");
    //查询物料
    let sql = "select * from pc.product.Product where id in (" + str_productIds + ")";
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    let productData = {};
    if (productInfo.length > 0) {
      for (let i = 0; i < productInfo.length; i++) {
        productData[productInfo[i].id] = productInfo[i];
      }
    }
    for (let i = 0; i < childRes.length; i++) {
      let is_handle = "";
      childRes[i].standard_code = productData[childRes[i].product_code].extend_standard_code;
      childRes[i].extend_package_specification = productData[childRes[i].product_code].extend_package_specification;
      childRes[i].remark = masObj[childRes[i].SY01_bad_drugv2_id].remark;
      childRes[i].date = masObj[childRes[i].SY01_bad_drugv2_id].date;
      childRes[i].is_handleM = is_handle;
      masterRes.push(childRes[i]);
    }
    return { masterRes };
  }
}
exports({ entryPoint: MyAPIHandler });