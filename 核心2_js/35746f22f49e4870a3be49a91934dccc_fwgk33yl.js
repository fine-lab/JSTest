let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    let body = { data: JSON.stringify(param.data), billnum: "sfa_opptcard" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", body);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });