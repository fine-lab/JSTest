let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let hmd = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd };
    let body = { name: "weige" };
    let base_path_openapi = "https://www.example.com/";
    var token1 = "393574d3a5d3437f8d37d8cdd92b14e6";
    let apiResponse = postman("post", base_path_openapi.concat("?access_token=" + token1), JSON.stringify(header), JSON.stringify(body));
    var resp = xml2json(apiResponse);
    //需要转换成json对象否则无法使用
    var jres = JSON.parse(resp);
    throw new Error("保存失败!" + jres.string[0]);
    return {};
  }
}
exports({ entryPoint: MyTrigger });