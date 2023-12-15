let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let base_path = "https://www.example.com/";
    let data = param.data[0];
    let id = "youridHere";
    var resdata = JSON.stringify(data);
    var resid = JSON.stringify(id);
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resid: resid
    };
    let func1 = extrequire("GT21859AT11.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(param);
    var token = res.access_token;
    // 请求数据
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });