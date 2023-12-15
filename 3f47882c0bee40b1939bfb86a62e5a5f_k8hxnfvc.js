let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let jirakey = request.jirakey;
    //调用PM接口，获取返回值
    let strResponse = postman("get", "https://www.example.com/" + jirakey);
    let JIRA_res = JSON.parse(strResponse);
    return { JIRA_res };
  }
}
exports({ entryPoint: MyAPIHandler });