let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param / data[0].id;
    // 获取token
    let func1 = extrequire("PU.rule.GetToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 组织单元详情查询
    let CGDeatil = postman("get", "https://www.example.com/" + token + "&id=" + id, JSON.stringify(headers), null);
    let CGAPI = JSON.parse(CGDeatil);
    throw new Error(JSON.stringify(1233));
    return {};
  }
}
exports({ entryPoint: MyTrigger });