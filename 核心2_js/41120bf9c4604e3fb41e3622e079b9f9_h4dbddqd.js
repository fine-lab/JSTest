let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var failurl = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForUploadFail";
    var succselurl = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForUploadFail";
    var akey = "yourkeyHere";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var objects = request.data;
    var res = "";
    //插入数据
    try {
      res = ObjectStore.insert("GT13741AT37.GT13741AT37.dayclosebill", objects, "e297ef0b");
    } catch (err) {
      return { err: err };
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });