let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let token = JSON.parse(AppContext()).token;
    var tenantId = JSON.parse(AppContext()).currentUser.tenantId;
    //信息体
    let body = {
      testBody: "testBody"
    };
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      cookie: `yht_access_token=${token}`
    };
    let host = "https://pro-thdangjian.yonisv.com";
    if (tenantId == "xlnc0rfy") {
      host = "https://dev-thdangjian.yonisv.com";
    }
    let url = host + "/be/demo/sync";
    let responseObj = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    return { responseObj };
  }
}
exports({ entryPoint: MyTrigger });