//获取原厂物料创建（物料档案)
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let proChildSql = "select * from pc.product.ProductDetail where productId = " + request.productId;
    let proChildRes = ObjectStore.queryByYonQL(proChildSql, "productcenter");
    if (typeof proChildRes != "undefined" && proChildRes != null && proChildRes.length > 0) {
      //通过供应商ID查询供应商名称
      if (typeof proChildRes[0].productVendor != "undefined") {
        let vendorSql = "select * from aa.vendor.Vendor where id = " + proChildRes[0].productVendor;
        let vendorRes = ObjectStore.queryByYonQL(vendorSql, "yssupplier");
        proChildRes[0].productVendorCode = vendorRes[0].code;
        proChildRes[0].productVendorName = vendorRes[0].name;
      }
    }
    return { proChildRes };
  }
}
exports({ entryPoint: MyAPIHandler });