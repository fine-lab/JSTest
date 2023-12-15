let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 判断页面状态
    var status = param.requestData._status;
    var price = 0;
    if (status == "Insert") {
      var oriUnitPrice = param.data[0].purchaseOrders[0].oriUnitPrice;
      var define1 = param.data[0].purchaseOrders[0].bodyFreeItem.define1;
      var id = param.data[0].id;
      price = oriUnitPrice - define1;
    } else {
      var sql123 = "select * from	pu.purchaseorder.PurchaseOrdersFreeItem where id = 1546438099332497417";
      var res123 = ObjectStore.queryByYonQL(sql123, "upu");
      throw new Error(JSON.stringify(res123));
      for (var i = 0; i < res123.length; i++) {
        var qq = res123[i];
      }
    }
    var oriUnitPrice = param.data[0].purchaseOrders[0].oriUnitPrice;
    var define1 = param.data[0].purchaseOrders[0].bodyFreeItem.define1;
    var id = param.data[0].id;
    var price = oriUnitPrice - define1;
    // 获取Token
    let func = extrequire("PU.API.Token");
    let res = func.execute(param);
    let token = res.access_token;
    // 获取动态域名
    let func1 = extrequire("PU.API.Domain");
    let res1 = func1.execute(param);
    let gatewayUrl = res1.gatewayUrl;
    if (price > 0) {
      // 调用接口
      let contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": contenttype
      };
      let body = { datas: [{ id: id, definesInfo: [{ define2: "true", isHead: true, isFree: true }] }] };
      let getExchangerate = gatewayUrl + "/yonbip/scm/purchaseorder/updateDefinesInfo?access_token=" + token;
      let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
      let rateresponseobj = JSON.parse(rateResponse);
      if (rateresponseobj.code == "200") {
      }
    } else {
      // 调用接口
      let contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": contenttype
      };
      var body = { datas: [{ id: id, definesInfo: [{ define2: "false", isHead: true, isFree: true }] }] };
      let getExchangerate = gatewayUrl + "/yonbip/scm/purchaseorder/updateDefinesInfo?access_token=" + token;
      let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(body));
      let rateresponseobj = JSON.parse(rateResponse);
      if (rateresponseobj.code == "200") {
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });