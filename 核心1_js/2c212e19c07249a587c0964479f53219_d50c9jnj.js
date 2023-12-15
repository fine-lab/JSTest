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
    let todoUrl = "https://www.example.com/";
    let todoRes = openLinker("POST", todoUrl, "PU", JSON.stringify(todoData));
    return {};
  }
}
exports({ entryPoint: MyTrigger });