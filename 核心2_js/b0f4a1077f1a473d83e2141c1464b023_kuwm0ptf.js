let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let user = ObjectStore.user();
    let tenantId = user.tenantId;
    let userId = user.id;
    //假设自己做了一套权限
    let author = ["A", "B", "C"];
    return { author };
  }
}
exports({ entryPoint: MyTrigger });