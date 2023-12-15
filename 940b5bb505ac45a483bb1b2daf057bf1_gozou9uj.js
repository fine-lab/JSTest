let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let sconfigFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    // 调接口删除待办
    let todoData = {
      srcMsgId: uuid(),
      businessKey: "yourKeyHere" + data.id,
      appId: sconfig.BASE.ordersAppId
    };
    let envUrl = ObjectStore.env().url;
    let todoUrl = envUrl + "/iuap-api-gateway/yonbip/uspace/rest/openapi/idempotent/todo/push/revocation";
    let todoRes = openLinker("POST", todoUrl, "PU", JSON.stringify(todoData));
    return {};
  }
}
exports({ entryPoint: MyTrigger });