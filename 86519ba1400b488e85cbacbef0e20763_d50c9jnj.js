let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let remainOrders = param.data[0].purchaseOrders;
    let id = param.data[0].id;
    let url = `https://c1.yonyoucloud.com/iuap-api-gateway/yonbip/scm/purchaseorder/detail?id=${id}`;
    let apiResponse = openLinker("GET", url, "PU", JSON.stringify({}));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code !== "999") {
      let {
        data: { purchaseOrders, vendor, code, extend57 }
      } = apiResponse;
      if (purchaseOrders) {
        let remainId = remainOrders.map((item) => item.id);
        let deleteOrders = purchaseOrders.filter((item) => !remainId.includes(item.id));
        if (deleteOrders.length) {
          let func1 = extrequire("PU.pubFunciton.deleteByOrders");
          let res = func1.execute(deleteOrders, vendor, code);
          return { res };
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });