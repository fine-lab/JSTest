let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var param = request.param;
    var url_pre = request.url;
    var is_test = true;
    var access_token = request.access_token;
    let suffix = "?" + "access_token=" + access_token;
    let mode = "POST";
    let url = url_pre + suffix;
    //请求头
    var header = { "Content-Type": "application/json" };
    let data = {};
    var tmp = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
    if (tmp != null) {
      data = JSON.parse(tmp);
    }
    if (is_test) {
      data.request = request;
    }
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });