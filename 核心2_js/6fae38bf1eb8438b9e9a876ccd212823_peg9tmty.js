let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ID = request.id;
    var sunID = request.sunID;
    var state = request.state;
    // 取消时间
    var cancelDate = request.cancelDate;
    // 取消人
    var cancelName = request.cancelName;
    // 验收人
    var affirmName = request.affirmName;
    // 验收日期
    var affirmDate = request.affirmDate;
    if (state == 0) {
      // 更新子表实体
      var sunnotarizeobject = { id: ID, product_lisList: [{ id: sunID, Confirm_status: "1", storageState: "2", _status: "Update" }] };
      var sunnotarizeresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", sunnotarizeobject, "e84ee900");
    }
    if (state == 1) {
      // 更新子表实体
      var suncancelobject = { id: ID, product_lisList: [{ id: sunID, Confirm_status: "0", storageState: "1", _status: "Update" }] };
      var suncancelresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", suncancelobject, "e84ee900");
    }
    if (state == 2) {
      // 更新子表实体
      var sunverifyobject = { id: ID, product_lisList: [{ id: sunID, storageState: "1", Confirm_status: "0", _status: "Update" }] };
      var sunverifyresult = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", sunverifyobject, "e84ee900");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });