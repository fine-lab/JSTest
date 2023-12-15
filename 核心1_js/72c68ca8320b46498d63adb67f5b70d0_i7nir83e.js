let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      processBusinessKeyIds: ["Test01_1795199427050733573"],
      source: "developplatform",
      assignee: "0904154e-6935-4c1d-b31c-cb8d3d35e3ba"
    };
    let url =
      "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT18D1050017C80003", JSON.stringify(body));
    throw new Error(JSON.stringify(apiResponse));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });