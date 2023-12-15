let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      fullname: "sfa.oppt.OpptDef",
      data: [{ id: request.id, define6: request.status }]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });