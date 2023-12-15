let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { userId: param.userId };
    let url = "https://www.example.com/";
    let res = openLinker("POST", url, "GT55714AT63", JSON.stringify(body));
    return res;
  }
}
exports({ entryPoint: MyTrigger });