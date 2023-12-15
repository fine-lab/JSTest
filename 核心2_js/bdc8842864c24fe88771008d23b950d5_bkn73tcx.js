let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let xiangmubianma = request.xiangmubianma != undefined ? request.xiangmubianma : undefined;
    let dept = request.dept != undefined ? request.dept : undefined;
    let param = {
      date: request.huijiqijian,
      dept: dept,
      htNumber: xiangmubianma,
      currentTime: request.currentTime
    };
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let url = "http://123.57.144.10:8890/bcp/update"; // 服务器地址
    var strResponse = postman("post", url, null, JSON.stringify(param));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });