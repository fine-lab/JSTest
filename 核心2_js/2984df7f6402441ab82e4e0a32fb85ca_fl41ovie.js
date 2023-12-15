let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let base_path = "https://www.example.com/";
    let data = param.data[0];
    var resdata = JSON.stringify(data);
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code == "001") {
      throw new Error(obj.message);
      return false;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });