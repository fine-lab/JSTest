let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let projectName = trim(request.projectName);
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      projectName: projectName
    };
    let projecttype = -1;
    var projectResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let projectResJson = JSON.parse(projectResp);
    if ("200" === projectResJson.code && projectResJson.data.length === 1) {
      projecttype = projectResJson.data[0].id;
    } else if ("200" === projectResJson.code && projectResJson.data.length > 1) {
      let recordList = projectResJson.data;
      for (let project of recordList) {
        if (projectName === project.name) {
          projecttype = project.id;
        }
      }
    }
    return { projecttype };
  }
}
exports({ entryPoint: MyAPIHandler });