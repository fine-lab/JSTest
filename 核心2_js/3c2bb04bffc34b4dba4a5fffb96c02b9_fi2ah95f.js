let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { name: request.name, call_num: request.call_num };
    var res1 = ObjectStore.selectByMap("GT37770AT29.GT37770AT29.buildma_infoV1_3", object);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("name", request.name).eq("call_num", request.call_num);
    // 待更新字段内容
    var toUpdate = { examFrequency: res1[0].examFrequency - 1 };
    // 执行更新
    var res = ObjectStore.update("GT37770AT29.GT37770AT29.buildma_infoV1_3", toUpdate, updateWrapper, "b7cf62f2");
    var object = { name: request.name, call_num: request.call_num };
    return { res, object };
  }
}
exports({ entryPoint: MyAPIHandler });