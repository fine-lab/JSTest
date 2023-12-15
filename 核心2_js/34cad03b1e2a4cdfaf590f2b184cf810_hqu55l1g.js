let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    let token = res.access_token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let getsdUrl = "https://www.example.com/" + token;
    let apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(param));
    let apiResponseJson = JSON.parse(apiResponse);
    let data = undefined;
    if (apiResponseJson.code == "200") {
      data = apiResponseJson.data.recordList;
    }
    return { data };
  }
}
exports({ entryPoint: MyTrigger });