let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 调用外部任务生成应收事项和进行异常预警
    let type = request.type;
    let date = request.date;
    let param = {
      type: type,
      date: date
    };
    let url = "http://123.57.144.10:8890/ImplementationProgress/getProgress";
    let progress = postman("post", url, null, JSON.stringify(param));
    return { progress };
  }
}
exports({ entryPoint: MyAPIHandler });