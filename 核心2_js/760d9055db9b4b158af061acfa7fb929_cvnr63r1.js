let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var code = request.code;
    var jsonContext = JSON.parse(AppContext());
    var currentUser = jsonContext.currentUser;
    var token = jsonContext.token;
    var tantentId = currentUser.tenantId;
    var env = "";
    if (!tantentId || !token) {
      throw new Error("用户过期未认证");
    }
    if (tantentId === "x3hacpnx") {
      //沙箱环境
      env = "https://www.example.com/";
    } else {
      //生产环境
      env = "https://www.example.com/";
    }
    var body = {
      wareId: id
    };
    var header = {
      "Content-Type": "application/json;charset=utf-8",
      Cookie: "yht_access_token=" + token
    };
    var url = "/bip/ware/disable?domainKey=ilogwms";
    var resp = postman("POST", env + url, JSON.stringify(header), JSON.stringify(body));
    if (resp) {
      var obj = JSON.parse(resp);
      if ("200" === obj.code) {
        return { result: "success" };
      } else {
        return { result: "fail", message: obj.message };
      }
    }
    return { result: "fail" };
  }
}
exports({ entryPoint: MyAPIHandler });