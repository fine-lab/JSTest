let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let org = param.org;
    let warehouse = param.warehouse;
    let product = param.product;
    let productsku = param.productsku;
    let getsdUrl = "https://www.example.com/";
    let body = {
      org: org,
      warehouse: warehouse,
      product: product,
      productsku: productsku
    };
    let apiResponse = openLinker("POST", getsdUrl, "GT80266AT1", JSON.stringify(body));
    let apiResponsejson = JSON.parse(apiResponse);
    let availableqty = 0;
    let message = apiResponsejson.message;
    let code = undefined;
    if (apiResponsejson.code == "200") {
      let data = apiResponsejson.data;
      code = 200;
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
      code = apiResponsejson.code;
    }
    let result = {
      code: code,
      availableqty: availableqty,
      message: message
    };
    return { result };
  }
}
exports({ entryPoint: MyTrigger });