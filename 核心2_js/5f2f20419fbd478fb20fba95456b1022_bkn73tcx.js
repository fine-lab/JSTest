let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let projectCode = request.projectCode != undefined ? request.projectCode : undefined;
    let dept = request.dept != undefined ? request.dept : undefined;
    let param = {
      date: request.huijiqijian,
      htNumber: projectCode,
      dept: dept,
      currentTime: request.currentTime
    };
    postman("post", "http://123.57.144.10:8890/dzbCbjz/send", null, JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });