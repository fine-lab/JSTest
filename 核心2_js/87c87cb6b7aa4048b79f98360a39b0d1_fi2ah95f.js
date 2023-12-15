let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestUrl = "https://www.example.com/";
    var access_token = request.token;
    var pageIndex = request.pageIndex;
    var pageSize = request.pageSize;
    var mainJobList_dept_id = request.mainJobList_dept_id;
    var requestBody = { access_token: access_token, pageIndex: pageIndex, pageSize: pageSize, "mainJobList.dept_id": mainJobList_dept_id };
    var requestHeader = { "Content-Type": "application/json" };
    var strResponse = postman("post", requestUrl + "?access_token=" + access_token, JSON.stringify(requestHeader), JSON.stringify(requestBody));
    var data = JSON.parse(strResponse);
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });