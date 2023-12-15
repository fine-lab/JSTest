let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { data: '[{"id":"1549456593991499777","closeReason":2504811623731456}]', billnum: "sfa_opptcard" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
  }
}
exports({ entryPoint: MyTrigger });