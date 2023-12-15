let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      pageIndex: 1,
      code: request.code,
      pageSize: 10,
      isSum: false,
      simpleVOs: [
        {
          op: "eq",
          value1: request.firstuplineno,
          field: "details.firstuplineno"
        }
      ]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1665917408780003", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });