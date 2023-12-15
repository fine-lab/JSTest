let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var objSql = request.sql;
    let body = {
      sql: objSql,
      key: 1639656465050,
      projetId: "yourIdHere",
      jobName: "费用分摊SQL"
    };
    let url =
      "https://www.example.com/";
    let apiResponse = openLinker("post", url, "GT64805AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });