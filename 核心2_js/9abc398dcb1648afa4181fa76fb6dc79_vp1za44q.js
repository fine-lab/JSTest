let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = {
      report: request.reportData
    };
    let header = { key: "yourkeyHere" };
    let url = "http://124.70.66.31:9994/newReport/newReportImport";
    let strResponse = postman("post", url, null, JSON.stringify(param));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });