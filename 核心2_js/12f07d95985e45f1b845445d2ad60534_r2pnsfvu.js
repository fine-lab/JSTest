let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param1) {
    debugger;
    let url = "https://www.example.com/";
    let body = { code: param1 };
    let res = postman("post", url, null, JSON.stringify(body));
    postman("get", "https://www.example.com/" + res, null, null);
    console.log(res);
    return res;
  }
}
exports({ entryPoint: MyTrigger });