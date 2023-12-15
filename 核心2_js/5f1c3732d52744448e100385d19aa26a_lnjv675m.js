let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let context = JSON.parse(AppContext());
    let tenantId = request.tenantId ? request.tenantId : context.currentUser.tenantId;
    var res = {};
    if (tenantId == "qpop8h6m") {
      res = {
        code: "00000",
        message: "成功！",
        data: {
          gatewayUrl: "https://www.example.com/",
          tokenUrl: "https://www.example.com/"
        }
      };
    } else {
      let url = "https://www.example.com/" + tenantId;
      const header = {
        "Content-Type": "application/json"
      };
      let apiResponse = postman("get", url, JSON.stringify(header), null);
      var res = JSON.parse(apiResponse);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });