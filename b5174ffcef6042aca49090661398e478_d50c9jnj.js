let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let reqData = JSON.parse(param.requestData);
    let { id } = reqData;
    let url = `https://c1.yonyoucloud.com/iuap-api-gateway/yonbip/scm/purchaseorder/detail?id=${id}`;
    let apiResponse = openLinker("GET", url, "PU", JSON.stringify({}));
    let {
      data: { purchaseOrders, vendor, code, extend57 }
    } = JSON.parse(apiResponse);
    let hasPriceOrders = purchaseOrders.filter((item) => item.extend119 && item.extend118);
    let func1 = extrequire("PU.pubFunciton.deleteByOrders");
    let res = func1.execute(hasPriceOrders, vendor, code);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });