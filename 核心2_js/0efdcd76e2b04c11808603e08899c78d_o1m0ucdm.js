let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 经过测试，不让改原厂的数据
    var object = { id: "youridHere", subject: "测试改标题" };
    var res = ObjectStore.updateById("AXT000132.AXT000132.purchaseRequest", object, "ycpraybill", "yonbip-cpu-sourcing");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });