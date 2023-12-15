let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var strResponse = postman(
      "get",
      "https://api.diwork.com/yonbip/digitalModel/currency/findByTime?access_token=966a90d6bdee4f6f98ece7343477618f&startTime=2018-03-01 00:00:00&endTime=2021-12-16 00:00:00",
      null,
      null
    );
    throw new Error(strResponse + JSON.stringify(strResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });