let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 调用外部任务生成下期预算
    let param = {
      date: request.huijiqijian,
      htNumber: request.project
    };
    let url = "http://123.57.144.40:8890/budget/makeNextBudget";
    let response = postman("post", url, null, JSON.stringify(param));
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });