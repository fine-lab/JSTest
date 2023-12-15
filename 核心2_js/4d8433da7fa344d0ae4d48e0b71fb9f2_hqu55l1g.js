let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let org = request.org;
    let warehouse = request.warehouse + "";
    let product = request.product + "";
    let productsku = request.productsku + "";
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let getsdUrl = "https://www.example.com/" + token;
    let body = {
      org: org,
      warehouse: warehouse,
      product: product,
      productsku: productsku
    };
    let apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponsejson = JSON.parse(apiResponse);
    let availableqty = 0;
    let message = apiResponsejson.message;
    let code = undefined;
    if (apiResponsejson.code == "200") {
      let data = apiResponsejson.data;
      code = 1;
      if (data != null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          let availableqtyData = data[i];
          //库存状态为0和正常的数据之和等于剩余现存量
          if (availableqtyData.stockStatusDoc == 0 || availableqtyData.stockStatusDoc == "2499988800296733") {
            availableqty = availableqty + availableqtyData.availableqty;
          }
        }
      }
    } else {
      code = 0;
    }
    let result = {
      code: code,
      availableqty: availableqty,
      message: message
    };
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });