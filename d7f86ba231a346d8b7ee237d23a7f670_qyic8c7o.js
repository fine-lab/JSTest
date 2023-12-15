let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const body = {
      page: {
        pageSize: 500,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "pc_productlinelist",
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
        solutionId: 1000083725,
        bInit: true
      },
      bEmptyWithoutFilterTree: true,
      serviceCode: "pc_productline",
      refimestamp: "1660108507548",
      ownDomain: "productcenter"
    };
    //信息头
    const header = {
      "Domain-Key": "productcenter",
      cookie: "yht_access_token=" + JSON.parse(AppContext()).token
    };
    let url = "https://www.example.com/";
    let responseStr = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let responseObj = JSON.parse(responseStr);
    return responseObj.code == 200 && responseObj.data;
  }
}
exports({ entryPoint: MyAPIHandler });