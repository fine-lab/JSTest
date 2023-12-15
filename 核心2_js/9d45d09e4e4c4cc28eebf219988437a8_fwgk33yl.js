let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = "tasz0ERoG9kqUJnHuxCZVKuLInq1ep8OwiMGFN9MpWlhY71638959400000https://u8c-daily.yyuap.com/service-adapter/rpc-adapter/gateway";
    var res = SHA256Encode(data);
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });