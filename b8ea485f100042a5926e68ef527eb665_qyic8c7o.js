let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      page: {
        pageSize: 20,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "cust_actioncontactlist",
      condition: {
        simpleVOs: [
          {
            field: "org",
            op: "eq",
            value1: "20a14e5e76314680a8f56c35fca0e520"
          },
          {
            field: "customer",
            op: "eq",
            value1: "1535987799891116040"
          }
        ],
        isExtend: true
      },
      serviceCode: "formalcustomer",
      isFromKanban: true,
      ownDomain: "yycrm",
      tplid: 4060786,
      queryId: 1669971654764
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "CUST", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });