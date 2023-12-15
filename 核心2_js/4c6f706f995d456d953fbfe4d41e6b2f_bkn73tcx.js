let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let projectCode = request.projectCode != undefined ? request.projectCode : undefined;
    let dept = request.dept != undefined ? request.dept : undefined;
    let param = {
      date: request.huijiqijian,
      htNumber: projectCode,
      currentTime: request.currentTime,
      dept: dept
    };
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let url = "http://123.57.144.10:8890/ChengBenGuiJi/send";
    var strResponse = postman("post", url, null, JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });