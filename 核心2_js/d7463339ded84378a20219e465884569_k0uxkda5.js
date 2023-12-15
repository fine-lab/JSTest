let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.data[0];
    let store = requestData.store;
    if (requestData.hasOwnProperty("store") && undefined != store && "" !== store) {
      let ischaidan = queryChaidanValue(store);
      if ("true" == ischaidan && requestData.hasOwnProperty("retailVouchDetails")) {
        let detail = requestData.retailVouchDetails;
        for (let k = 0; k < detail.length; k++) {
          let product = detail[k].product;
          let attrext4 = queryaccmaterialOrgID(product);
          if (undefined != attrext4 && "" !== attrext4 && "undefined" != attrext4) {
            if (!detail[k].hasOwnProperty("retailVouchDetailDefineCharacter")) {
              detail[k].set("retailVouchDetailDefineCharacter", {});
              detail[k].retailVouchDetailDefineCharacter.set("bodyDefine2", attrext4 + "");
            } else {
              detail[k].retailVouchDetailDefineCharacter.set("bodyDefine2", attrext4 + "");
            }
          }
        }
      }
    }
    //查询物料库存组织
    function queryaccmaterialOrgID(productID) {
      let sql = "select * from 		pc.product.ProductCharacterDef	where  id='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var attrext4 = "";
      if (undefined != res && res.length > 0) {
        if (res[0].hasOwnProperty("attrext13")) {
          let attrext13 = res[0].attrext13;
          if ("代售结算商品" == attrext13 || "普通结算商品" == attrext13) {
            if (res[0].hasOwnProperty("attrext4")) attrext4 = res[0].attrext4;
          }
        }
      }
      return attrext4;
    }
    //门店拆单属性
    function queryChaidanValue(store) {
      let sql = "select * from 		aa.store.StoreDefineCharacter	where  id='" + store + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      var attrext14 = "";
      if (undefined != res && res.length > 0) {
        if (res[0].hasOwnProperty("attrext14")) attrext14 = res[0].attrext14;
      }
      return attrext14;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });