let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      pageIndex: 0,
      pageSize: 100,
      simpleVOs: [
        {
          field: "storeProRecords.sourceGrandchildrenId",
          op: "eq",
          value1: request.upcodeFather
        }
      ]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    return apiResponse.data;
  }
}
exports({ entryPoint: MyAPIHandler });