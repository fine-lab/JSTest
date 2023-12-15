let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let httpurl = "http://114.55.58.238:8080";
    if (
      data.hasOwnProperty("sourcesys") &&
      "retail" == data.sourcesys &&
      data.hasOwnProperty("store") &&
      data.hasOwnProperty("id") &&
      data.hasOwnProperty("srcBillType") &&
      "retailvouch" == data.srcBillType
    ) {
      let store = data.store;
      if (undefined != store) {
        retailSave2(data, httpurl);
      }
    } else {
      order2Save(data, httpurl);
    }
    function retailSave(data, httpurl) {
      let store = data.store;
      let id = data.id;
      let url = httpurl + "/saleOut/retailSaleOutSave?store=" + store + "&id=" + id;
      let header = { "content-type": "application/json;charset=utf-8" };
      let bipUrlResponse = postman("get", url, JSON.stringify(header), null);
    }
    function retailSave2(data, httpurl) {
      let url = httpurl + "/saleOut/retail2SaleOutSave";
      let header = { "content-type": "application/json;charset=utf-8" };
      let bipUrlResponse = postman("post", url, JSON.stringify(header), JSON.stringify(data));
    }
    function orderSave(data, httpurl) {
      let org = data.org;
      let id = data.id;
      let url = httpurl + "/saleOut/orderSaleOutSave?org=" + org + "&id=" + id;
      let header = { "content-type": "application/json;charset=utf-8" };
      let bipUrlResponse = postman("get", url, JSON.stringify(header), null);
    }
    function order2Save(data, httpurl) {
      let url = httpurl + "/saleOut/order2SaleOutSave";
      let header = { "content-type": "application/json;charset=utf-8" };
      let bipUrlResponse = postman("post", url, JSON.stringify(header), JSON.stringify(data));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });