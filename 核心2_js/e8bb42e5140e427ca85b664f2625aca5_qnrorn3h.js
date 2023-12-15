let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sd = new Object();
    sd.sss = "ddddddddddddddddd";
    var str = JSON.stringify(sd);
    var object = { title: "activityEndMessage", content: str };
    var res = ObjectStore.insert("AT1639DE8C09880005.AT1639DE8C09880005.log01", object, "28a1fbe5");
    var strResponse = postman("get", "https://debug.vmapi.cn", null, str);
    return sd;
  }
}
exports({ entryPoint: MyTrigger });