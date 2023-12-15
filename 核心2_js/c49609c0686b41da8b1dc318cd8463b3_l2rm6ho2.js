let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var url = "https://www.example.com/" + request.access_token;
    var strResponse = postman("post", url, null, JSON.stringify(request.params));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //请求成功
      var data = responseObj.data.content;
      var price = -1;
      for (var i in data) {
        if (parseFloat(data[i]["lowerLimit"]) < parseFloat(request.quantity)) {
          if (parseFloat(data[i]["price"]) < price || price == -1) {
            price = parseFloat(data[i]["price"]);
          }
        }
      }
      if (price != -1) return { price: price, strResponse: JSON.parse(strResponse) };
      var producturl = "https://www.example.com/" + request.access_token;
      strResponse = postman("post", producturl, null, JSON.stringify(request.params));
      responseObj = JSON.parse(strResponse);
      if ("200" == responseObj.code) {
        data = responseObj.data.content;
        for (var j in data) {
          if (parseFloat(data[j]["lowerLimit"]) < parseFloat(request.quantity)) {
            if (parseFloat(data[j]["price"]) < price || price == -1) {
              price = parseFloat(data[j]["price"]);
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