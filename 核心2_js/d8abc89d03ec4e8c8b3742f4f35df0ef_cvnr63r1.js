let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var jsonContext = JSON.parse(AppContext());
    var currentUser = jsonContext.currentUser;
    var id = param.data[0].id;
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
    env = "http://l455x63839.qicp.vip:41396";
    var body = {
      wareId: id,
      docType: "pc_archive_ware", //仓库档案
      action: "disable" //仓库停用
    };
    var header = {
      "Content-Type": "application/json;charset=utf-8",
      Cookie: "yht_access_token=" + token
    };
    var url = "/bip/ware/action?domainKey=ilogwms";
    var resp = postman("POST", env + url, JSON.stringify(header), JSON.stringify(body));
    if (resp) {
      var obj = JSON.parse(resp);
      if ("200" != obj.code) {
        throw new Error(obj.message);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });