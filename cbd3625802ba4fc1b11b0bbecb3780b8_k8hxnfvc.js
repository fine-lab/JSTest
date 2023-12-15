let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let logObject = {
      log_contractid: id,
      log_sync_is_last: "是",
      log_sync_status: "成功",
      log_sync_source: "合同生效"
    };
    let logRes = ObjectStore.selectByMap("GT3407AT1.GT3407AT1.yc_contract_sync_log", logObject);
    let isChanging = "N";
    if (logRes && logRes.length > 0) {
      isChanging = "Y";
    }
    let param = { head: {}, body: [{}] };
    //合同生效
    if (isChanging == "N") {
    }
    //合同变更
    if (isChanging == "Y") {
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });