let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 可以弹出具体的信息（类似前端函数的alert）
    //信息体
    let body = {
      page: { pageSize: 20, pageIndex: 1, totalCount: -1 },
      billnum: "a470d83aList",
      condition: {
        commonVOs: [
          { itemName: "schemeName", value1: "默认方案" },
          { itemName: "isDefault", value1: true }
        ],
        filtersId: "yourIdHere",
        solutionId: 250050145
      },
      bClick: true,
      bEmptyWithoutFilterTree: true,
      serviceCode: "1573217924769906693",
      refimestamp: "1671761107430",
      ownDomain: "developplatform",
      tplid: 50025404,
      queryId: 1671761127402
    };
    //信息头
    let header = {};
    // 可以直观的看到具体的错误信息
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {
      request,
      responseObj
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});