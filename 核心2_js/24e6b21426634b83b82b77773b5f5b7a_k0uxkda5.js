let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let canku = "1758736666307067911";
    let test = getcanku(canku);
    let test1 = queryaccmaterialOrgID2();
    //查询物料库存组织
    function queryaccmaterialOrgID(productID) {
      let sql = "select * from 		pc.product.ProductFreeDefine	where  id='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var define1 = "";
      if (undefined != res && res.length > 0) {
        if (res[0].hasOwnProperty("define4")) {
          let define4 = res[0].define4;
          if ("代售结算商品" == define4 || "普通结算商品" == define4) {
            if (res[0].hasOwnProperty("define1")) define1 = res[0].define1;
          }
        }
      }
      return define1;
    }
    function queryChaidanValue1(store) {
      let sql = "select * from 		aa.store.StoreCustomItem	where  id='" + store + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      var define1 = "";
      if (undefined != res && res.length > 0) {
        if (res[0].hasOwnProperty("define1")) define1 = res[0].define1;
      }
      return define1;
    }
    function queryaccmaterialOrgID1(productID) {
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
    function queryChaidanValue(store) {
      let sql = "select * from 		aa.store.StoreDefineCharacter	where  id='" + store + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      var attrext14 = "";
      if (undefined != res && res.length > 0) {
        if (res[0].hasOwnProperty("attrext14")) attrext14 = res[0].attrext14;
      }
      return attrext14;
    }
    function getcanku(id) {
      let conswarehouse = "";
      let freesql = " select * from aa.warehouse.WarehouseDefineCharacter  where  id='" + id + "'";
      let rreeDefineres = ObjectStore.queryByYonQL(freesql, "productcenter");
      if (undefined != rreeDefineres && rreeDefineres.length > 0) {
        if (rreeDefineres[0].hasOwnProperty("attrext22")) {
          let attrext22 = rreeDefineres[0].attrext22;
          if ("true" == attrext22 || attrext22) {
            conswarehouse = id;
          }
        }
      }
      return conswarehouse;
    }
    function getcanku1(id) {
      let conswarehouse = "";
      let freesql = " select * from aa.warehouse.WarehouseFreeDefine where  id='" + id + "'";
      let rreeDefineres = ObjectStore.queryByYonQL(freesql, "productcenter");
      if (undefined != rreeDefineres && rreeDefineres.length > 0) {
        if (rreeDefineres[0].hasOwnProperty("define1")) {
          let define1 = rreeDefineres[0].define1;
          if ("true" == define1 || define1) {
            conswarehouse = id;
          }
        }
      }
      return conswarehouse;
    }
    function queryaccmaterialOrgID2() {
      let sql = "select productPropCharacterDefine.define91 suppluid,id ,productPropCharacterDefine.define91.name supplyname from 		pc.product.Product";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      return res;
    }
    return { test: test, test1: test1 };
  }
}
exports({ entryPoint: MyAPIHandler });