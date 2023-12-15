let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(param) {
    let body = { data: param.data, billnum: "sfa_opptcard" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", body);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });