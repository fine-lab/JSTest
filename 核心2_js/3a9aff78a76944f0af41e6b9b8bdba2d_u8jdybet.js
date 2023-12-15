let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    //锁定相应的记录
    var updateWrapper = new Wrapper();
    updateWrapper.eq("shoudaCode", data.shoudaCode).eq("type", "0");
    var toUpdate = { lck: data.lck };
    var res = ObjectStore.update("AT16F632B808C80005.AT16F632B808C80005.Merchant3", toUpdate, updateWrapper, "ybff7b95d3");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });