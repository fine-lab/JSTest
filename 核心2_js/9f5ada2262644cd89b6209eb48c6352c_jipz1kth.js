let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    let base_path = "https://www.example.com/";
    var resdata = JSON.stringify(param.data);
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: resdata
    };
    let func1 = extrequire("GT18216AT3.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(param);
    var token = res.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });