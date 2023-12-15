let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  //查询物料单位相关,如果unitId存在的话只返回当前单位换算信息
  getProductUnitInfo(productId, unitId) {
    let res = queryUtils.getQueryResult("aa.product.ProductAssistUnitExchange", productId, "productcenter", "productId");
    if (!res || res.length <= 0) {
      return null;
    }
    if (unitId) {
      for (let i = 0; i < res.length; i++) {
        let resLine = res[i];
        if (resLine.assistUnit == unitId) {
          let unitRes = queryUtils.getQueryResult("aa.product.ProductUnit", unitId, "productcenter");
          if (unitRes) {
            Object.assign(resLine, unitRes[0]);
          }
          return resLine;
        }
      }
    }
    return res;
  }
  //查询物料id
  getProductId(name) {
    let sql = "select id from aa.product.Product where ";
    sql += "(cCode='" + name + "' or cName='" + name + "')";
    let res = null;
    res = ObjectStore.queryByYonQL(sql, "productcenter");
    if (queryUtils.isEmpty(res)) {
      return null;
    }
    return res[0].id + "";
  }
  //查询物料skuid
  getProductSkuId(name) {
    let sql = "select id from aa.product.ProductSKU where ";
    sql += "(cCode='" + name + "' or skuName='" + name + "')";
    let res = null;
    res = ObjectStore.queryByYonQL(sql, "productcenter");
    if (queryUtils.isEmpty(res)) {
      return null;
    }
    return res[0].id + "";
  }
  //查询物料单位id
  getProductUnitId(name) {
    let sql = "select id from aa.product.ProductUnit where ";
    sql += "(code='" + name + "' or name='" + name + "')";
    let res = null;
    res = ObjectStore.queryByYonQL(sql, "productcenter");
    if (queryUtils.isEmpty(res)) {
      return null;
    }
    return res[0].id + "";
  }
  //查询物料单位id
  getProductUnit(product) {
    let sql = "select unit,unitUseType,enableAssistUnit,productTemplate " + "from pc.product.Product where id=" + product;
    let productInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    let unit = productInfo[0].unit;
    let enableAssistUnit = productInfo[0].enableAssistUnit;
    if (queryUtils.isEmpty(enableAssistUnit) || !enableAssistUnit) {
      productInfo[0].stockUnit = { assistUnit: unit, mainUnitCount: 1, unitExchangeType: 0 };
      productInfo[0].purchaseUnit = { assistUnit: unit, mainUnitCount: 1, unitExchangeType: 0 };
      productInfo[0].batchUnit = { assistUnit: unit, mainUnitCount: 1, unitExchangeType: 0 };
      return productInfo;
    }
    sql = "select stockUnit,purchaseUnit,batchUnit " + "from pc.product.ProductExtend where id=" + product;
    let productExtendInfo = ObjectStore.queryByYonQL(sql, "productcenter");
    let stockUnitId = productExtendInfo[0].stockUnit;
    let purchaseUnitId = productExtendInfo[0].purchaseUnit;
    let batchUnitId = productExtendInfo[0].batchUnit;
    let assistUnitExchange = null;
    if (productInfo[0].unitUseType === 1) {
      let productTemplate = productInfo[0].productTemplate;
      sql = "select assistUnit,mainUnitCount,unitExchangeType " + "from pc.tpl.ProductTplAssistUnitExchange where template=" + productTemplate;
      assistUnitExchange = ObjectStore.queryByYonQL(sql, "productcenter");
    } else {
      sql = "select assistUnit,mainUnitCount,unitExchangeType " + "from pc.product.ProductAssistUnitExchange where productId=" + product;
      assistUnitExchange = ObjectStore.queryByYonQL(sql, "productcenter");
    }
    if (stockUnitId == unit) {
      productInfo[0].stockUnit = { assistUnit: unit, mainUnitCount: 1, unitExchangeType: 0 };
    }
    if (purchaseUnitId == unit) {
      productInfo[0].purchaseUnit = { assistUnit: unit, mainUnitCount: 1, unitExchangeType: 0 };
    }
    if (batchUnitId == unit) {
      productInfo[0].batchUnit = { assistUnit: unit, mainUnitCount: 1, unitExchangeType: 0 };
    }
    for (let i = 0; i < assistUnitExchange.length; i++) {
      let assistUnit = assistUnitExchange[i].assistUnit;
      let mainUnitCount = assistUnitExchange[i].mainUnitCount;
      let unitExchangeType = assistUnitExchange[i].unitExchangeType;
      let subUnitObj = { assistUnit: assistUnit, mainUnitCount: mainUnitCount, unitExchangeType: unitExchangeType };
      if (assistUnit == unit) {
        continue;
      }
      if (stockUnitId == assistUnit) {
        productInfo[0].stockUnit = subUnitObj;
      } else if (purchaseUnitId == assistUnit) {
        productInfo[0].purchaseUnit = subUnitObj;
      } else if (batchUnitId == assistUnit) {
        productInfo[0].batchUnit = subUnitObj;
      }
    }
    productInfo[0].assistUnitExchange = assistUnitExchange;
    return productInfo;
  }
}
exports({ entryPoint: MyTrigger });