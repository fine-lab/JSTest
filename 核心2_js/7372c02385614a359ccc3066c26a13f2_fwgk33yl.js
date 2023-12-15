let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      var requestData = param.requestData.orderDetails === undefined ? JSON.parse(param.requestData) : param.requestData;
    } catch (e) {
      // 页面为空
      return;
    }
    var id = requestData.id;
    let allSplitingRule = postman("get", "https://pomp-daily.yonyou.com/app-bip/#/crm/clue?id=" + id, "", "");
    return { allSplitingRule };
  }
}
exports({ entryPoint: MyTrigger });