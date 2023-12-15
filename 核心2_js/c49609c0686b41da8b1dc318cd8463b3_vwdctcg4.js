let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let uriFunc = extrequire("GT4691AT1.publicfun.getdomainurl");
    let uriRes = uriFunc.execute("", "");
    let gatewayurl = uriRes.domainurl.gatewayUrl;
    let url = gatewayurl + "/yonbip/sd/goods/price/customerproduct/list?access_token=" + request.access_token;
    let strResponse = postman("post", url, null, JSON.stringify(request.params));
    let responseObj = JSON.parse(strResponse);
    let lastDate;
    if ("200" == responseObj.code) {
      //请求成功
      let data = responseObj.data.content;
      let price = -1;
      for (let i in data) {
        if (parseFloat(data[i]["lowerLimit"]) < parseFloat(request.quantity)) {
          if (lastDate == undefined || new Date(lastDate).getTime() < new Date(data[i]["startDate"]).getTime()) {
            price = parseFloat(data[i]["price"]);
            lastDate = data[i]["startDate"];
          }
        }
      }
      if (price != -1) return { price: price, strResponse: JSON.parse(strResponse) };
      let producturl = gatewayurl + "/yonbip/sd/goods/price/productprice/page?access_token=" + request.access_token;
      strResponse = postman("post", producturl, null, JSON.stringify(request.params));
      responseObj = JSON.parse(strResponse);
      if ("200" == responseObj.code) {
        data = responseObj.data.content;
        for (let j in data) {
          if (parseFloat(data[j]["lowerLimit"]) < parseFloat(request.quantity)) {
            if (lastDate == undefined || new Date(lastDate).getTime() < new Date(data[j]["startDate"]).getTime()) {
              price = parseFloat(data[j]["price"]);
              lastDate = data[j]["startDate"];
            }
          }
        }
        if (price != -1) return { price: price, strResponse: JSON.parse(strResponse) };
      }
    }
    return { strResponse: strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });