let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    let staff_by_userid_url = "https://www.example.com/" + userId;
    let staffInfo = openLinker("GET", staff_by_userid_url, "GT1431AT3", null); //TODO：注意填写应用编码(请看注意事项)
    return { request, staff_by_userid_url, staffInfo };
  }
}
exports({ entryPoint: MyAPIHandler });