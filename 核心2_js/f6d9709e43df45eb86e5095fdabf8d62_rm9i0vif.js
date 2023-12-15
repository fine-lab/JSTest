let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      //先通过产品标识 查询列表是否存在，在通过id 去查询管理的商品，在通过商品id，查询商品信息带出
      let configure2 = "select * from GT22176AT10.GT22176AT10.sy01_udi_product_configure2  where bzcpbs = " + request.proCode + " and dr = 0";
      let configure2Rs = ObjectStore.queryByYonQL(configure2);
      if (configure2Rs.length == 0 || typeof configure2Rs == "undefined") {
        configure2Rs = [];
        return { configure2Rs };
      }
      let proInfo =
        "select *,product.productDetail.isSerialNoManage,product.productDetail.isBatchManage,product.productDetail.isExpiryDateManage from GT22176AT10.GT22176AT10.sy01_udi_product_info where id =  " +
        configure2Rs[0].sy01_udi_product_info_id +
        " and dr = 0";
      let proRes = ObjectStore.queryByYonQL(proInfo);
      if (proRes.length == 0 || typeof proRes == "undefined") {
        proRes = [];
        return { configure2Rs, proRes };
      }
      //获取主表信息
      let productUDISql = "select * from GT22176AT10.GT22176AT10.sy01_udi_relation_product where id = " + proRes[0].sy01_udi_relation_product_id + " and dr = 0";
      let udiProListRs = ObjectStore.queryByYonQL(productUDISql);
      if (udiProListRs.length == 0 || typeof udiProListRs == "undefined") {
        udiProListRs = [];
        return { configure2Rs, proRes, udiProListRs };
      }
      //获取产品标识库信息
      let productUDIListSql = "select * from GT22176AT10.GT22176AT10.sy01_udi_product_list where id = " + udiProListRs[0].productUdi + " and dr = 0";
      let productUDIListRs = ObjectStore.queryByYonQL(productUDIListSql);
      let product = "select id,name,  manageClass,code from pc.product.Product where id =" + proRes[0].product;
      let productRs = ObjectStore.queryByYonQL(product);
      return { proRes, configure2Rs, productRs, udiProListRs, productUDIListRs };
    } catch (e) {
      throw new Error("网络异常！请重试！" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });