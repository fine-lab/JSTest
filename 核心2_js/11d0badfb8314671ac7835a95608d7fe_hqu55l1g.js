let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let url = "https://www.example.com/" + token + "&id=" + param;
    let apiResponse = postman("GET", url, JSON.stringify(header), null);
    let apiResponsejson = JSON.parse(apiResponse);
    let data = undefined;
    if (apiResponsejson.code == "200") {
      data = apiResponsejson.data;
    }
    return { data };
  }
}
exports({ entryPoint: MyTrigger });