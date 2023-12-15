let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let saleOrder = param;
    let body = {
      pageIndex: "1",
      pageSize: "10",
      isSum: "false",
      simpleVOs: [
        {
          field: "code",
          op: "eq",
          value1: param
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
    let result = undefined;
    if (apiResponseJson.code == "200") {
      let data = apiResponseJson.data;
      if (data.recordCount > 0) {
        result = true;
      } else {
        result = false;
      }
    }
    return { result };
  }
}
exports({ entryPoint: MyTrigger });