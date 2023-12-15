let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiResponse = apiman("get", "http://10.2.108.27:8080/trainmgr-be/blogquery/querychannel", null, null);
    return {};
  }
}
exports({ entryPoint: MyTrigger });