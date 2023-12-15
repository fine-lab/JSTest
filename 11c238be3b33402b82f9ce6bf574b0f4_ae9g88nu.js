let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sku = request.skuId;
    let product = request.proId;
    let masterObject = {};
    let masterRes = [];
    if (typeof sku != "undefined" && sku != null && typeof product != "undefined" && product != null) {
      masterObject = { org_id: request.orgId, supplierCode: request.supplierCode, skuCode: sku, productCode: product, dr: 0 };
      masterRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_qualified_supply", masterObject);
      if (typeof masterRes == "undefined" || masterRes == null || masterRes.length > 0) {
        masterObject = { org_id: request.orgId, supplierCode: request.supplierCode, productCode: product, dr: 0 };
        masterRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_qualified_supply", masterObject);
      }
    } else if (typeof sku == "undefined" && sku == null && typeof product != "undefined" && product != null) {
      masterObject = { org_id: request.orgId, supplierCode: request.supplierCode, productCode: product, dr: 0 };
      masterRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_qualified_supply", masterObject);
    } else if (typeof product == "undefined" && product == null) {
      masterObject = { supplierCode: request.supplierCode, dr: 0 }; //"org_id": request.orgId,
      masterRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_qualified_supply", masterObject);
    }
    let attorneyChild = [];
    if (masterRes.length > 0) {
      for (let i = 0; i < masterRes.length; i++) {
        let attorneyObject = { SY01_qualified_supply_id: masterRes[i].id, dr: 0 };
        let attorneyRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_attorney", attorneyObject);
        for (let j = 0; j < attorneyRes.length; j++) {
          attorneyChild.push(attorneyRes[j]);
        }
        masterRes[i].attorney = attorneyChild;
      }
    }
    return { masterRes };
  }
}
exports({ entryPoint: MyAPIHandler });