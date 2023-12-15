let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const body = {
      page: {
        pageSize: 20,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "0c53d768",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "默认方案"
          },
          {
            itemName: "isDefault",
            value1: true
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 201001266,
        bInit: true
      },
      bEmptyWithoutFilterTree: true,
      designPreview: "true",
      queryId: 1674018388031
    };
    //信息头
    const header = {
      "Domain-Key": "developplatform",
      cookie: "yht_access_token=" + JSON.parse(AppContext()).token
    };
    let url = "https://www.example.com/";
    let responseStr = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let responseObj = JSON.parse(responseStr);
    return responseObj.code == 200 && responseObj.data;
  }
}
exports({
  entryPoint: MyAPIHandler
});