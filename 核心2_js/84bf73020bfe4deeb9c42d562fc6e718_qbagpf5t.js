let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { sql: "c2VsZWN0JTIwKiUyMGZyb20lMjBkZXRhaWwlMjBsaW1pdCUyMDEw", key: 1639656465050, projetId: "yourIdHere", jobName: "费用分摊SQL" };
    let url =
      "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT64805AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });