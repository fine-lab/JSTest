let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 调用外部任务生成应收事项和进行异常预警
    let htNumber = request.hth != undefined ? request.hth : undefined;
    let dept = request.dept != undefined ? request.dept : undefined;
    let param = {
      date: request.qianshouri,
      htNumber: htNumber,
      dept: dept,
      currentTime: request.currentTime
    };
    let url = "http://123.57.144.10:8890/cbjz/send";
    postman("post", url, null, JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });