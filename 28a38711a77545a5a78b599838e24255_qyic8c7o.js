let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      fullname: "sfa.clue.ClueDef",
      data: [{ id: request.id, define28: request.clueNet }]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });