let AbstractTrigger = require("AbstractTrigger");
const getCurrentQty = (org, warehouse, product) => {
  let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
  let staffUrl = DOMAIN + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
  let currentQty = 0;
  let body = { org: org, warehouse: warehouse, product: product };
  let apiRes = openLinker("POST", staffUrl, "GT3734AT5", JSON.stringify(body)); //HRED
  let resObj = JSON.parse(apiRes);
  if (resObj.code == 200 && resObj.data.length > 0) {
    let kcList = resObj.data;
    for (var i in kcList) {
      let kcObj = kcList[i];
      currentQty = currentQty + kcObj.currentqty;
    }
  }
  return currentQty;
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let orgid = pdata.org_id;
    let lpck = pdata.lpck;
    let lplymxList = pdata.lplymxList;
    for (var i in lplymxList) {
      let rowData = lplymxList[i];
      let wpmcid = rowData.wpmc;
      let currentQty = getCurrentQty(orgid, lpck, wpmcid);
      if (rowData.lysl > currentQty) {
        throw new Error("礼品领用明细第[" + (Number(i) + 1) + "]行领用数量大于即时库存数量,不能保存!");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });