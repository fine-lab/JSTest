let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let workDate = request.workDate;
    let res = AppContext();
    let obj = JSON.parse(res);
    let tid = obj.currentUser.tenantId;
    let userId = obj.currentUser.id;
    let data = {
      workDate: workDate,
      tid: tid,
      userId: userId,
      orgId: "yourIdHere"
    };
    let url = "https://www.example.com/";
    let apiResponse = postman("POST", url, null, JSON.stringify(data));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });