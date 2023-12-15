let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      fullname: "sfa.clue.Clue",
      data: [{ id: request.id, source_name: request.source_name, source_code: request.source_code, clueType_name: request.clueType_name, transType: request.transType }]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });