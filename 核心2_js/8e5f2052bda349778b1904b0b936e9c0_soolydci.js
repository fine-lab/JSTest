let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let projectCode = request.projectCode;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      code: projectCode,
      pageIndex: 1,
      pageSize: 10
    };
    let project;
    var projectResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let projectResJson = JSON.parse(projectResp);
    if ("200" === projectResJson.code) {
      project = projectResJson.data.recordList;
    }
    return { project };
  }
}
exports({ entryPoint: MyAPIHandler });