let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var code = request.code;
    let url = "https://www.example.com/" + id + "&code=" + code;
    let resp = openLinker("GET", url, "GT30660AT4", JSON.stringify({}));
    return JSON.parse(resp);
  }
}
exports({ entryPoint: MyAPIHandler });