let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //参数
    let param = {
      signature: request.signature,
      timestamp: request.timestamp,
      nonce: request.nonce,
      companyid: request.companyid,
      appid: request.appid,
      eventkey: request.eventkey,
      eventid: request.eventid,
      eventtime: request.eventtime
    };
    let res = ObjectStore.insert("AT179C7CF609400008.AT179C7CF609400008.eventPush", param, "yb364878a3");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });