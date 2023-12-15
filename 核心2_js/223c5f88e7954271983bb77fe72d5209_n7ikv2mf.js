let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateWrapper = new Wrapper();
    updateWrapper.eq("verifystate", 2);
    // 待更新字段内容
    var toUpdate = { profPartnerType: "COT" };
    var res = ObjectStore.update("GT30659AT3.GT30659AT3.ssp_parter_apply_cot", toUpdate, updateWrapper, "e1dbbda4");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });