let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      //先通过产品标识 查询列表是否存在，在通过id 去查询管理的商品，在通过商品id，查询商品信息带出
      let configure2 = "select * from I0P_UDI.I0P_UDI.sy01_udi_product_configurev3  where bzcpbs = " + request.proCode + " and dr = 0";
      let configure2Rs = ObjectStore.queryByYonQL(configure2, "isv-ud1");
      if (configure2Rs.length == 0 || typeof configure2Rs == "undefined") {
        configure2Rs = [];
        return { configure2Rs };
      }
      let proInfo =
        "select *,product.productDetail.isSerialNoManage isSerialNoManage,product.productDetail.isBatchManage isBatchManage,product.productDetail.isExpiryDateManage isExpiryDateManage from I0P_UDI.I0P_UDI.sy01_udi_product_infov3 where id =  " +
        configure2Rs[0].sy01_udi_product_info_id +
        " and dr = 0";
      let proRes = ObjectStore.queryByYonQL(proInfo, "isv-ud1");
      if (proRes.length == 0 || typeof proRes == "undefined") {
        proRes = [];
        return { configure2Rs, proRes };
      }
      if (proRes.length > 1) {
        let tempres = [];
        for (var i = 0; i < proRes.length; i++) {
          if (configure2Rs[0].sy01_udi_product_info_id === proRes[i].id) {
            tempres.push(proRes[i]);
            break;
          }
        }
        if (tempres.length > 0) {
          proRes = [];
          proRes.push(tempres[0]);
        }
      }
      //获取主表信息
      let productUDISql = "select * from I0P_UDI.I0P_UDI.sy01_udi_relation_productv3 where id = " + proRes[0].sy01_udi_relation_product_id + " and dr = 0";
      let udiProListRs = ObjectStore.queryByYonQL(productUDISql, "isv-ud1");
      if (udiProListRs.length == 0 || typeof udiProListRs == "undefined") {
        udiProListRs = [];
        return { configure2Rs, proRes, udiProListRs };
      }
      //获取产品标识库信息
      let productUDIListSql = "select * from I0P_UDI.I0P_UDI.sy01_udi_product_listv3 where id = " + udiProListRs[0].productUdi + " and dr = 0";
      let productUDIListRs = ObjectStore.queryByYonQL(productUDIListSql, "isv-ud1");
      let product = "select id,name,  manageClass,code from pc.product.Product where id =" + proRes[0].product;
      let productRs = ObjectStore.queryByYonQL(product, "upu");
      return { proRes, configure2Rs, productRs, udiProListRs, productUDIListRs };
    } catch (e) {
      throw new Error("网络异常！请重试！" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });