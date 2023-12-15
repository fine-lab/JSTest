let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let token = ObjectStore.env().token;
    var resp = JSON.parse(JSON.stringify(param));
    var obj = JSON.parse(resp.requestData);
    var object = { id: obj[0].id };
    var res = ObjectStore.selectByMap("AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode", object);
    var verifystate = res[0].verifystate;
    var escid = res[0].escid;
    let body = { verifystate: verifystate, escid: escid, token: token };
    let header = {};
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });