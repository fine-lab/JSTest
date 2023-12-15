let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let saleOrder = param;
    let body = {
      billnum: "voucher_order",
      datas: [
        {
          id: saleOrder.id + "",
          code: saleOrder.code,
          definesInfo: [
            {
              define3: "true",
              isHead: true,
              isFree: true,
              detailIds: ""
            }
          ]
        }
      ]
    };
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let getsdUrl = "https://www.example.com/" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponseJson = JSON.parse(apiResponse);
    let result = {
      code: apiResponseJson.code,
      message: saleOrder.code + "_" + apiResponseJson.message
    };
    return { result };
  }
}
exports({ entryPoint: MyTrigger });