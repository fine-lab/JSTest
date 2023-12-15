let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var options = {
      domainKey: "yourKeyHere",
      async: false
    };
    var proxy1212 = cb.rest.DynamicProxy.create({
      settle: {
        url: "https://www.example.com/",
        method: "POST",
        options: options
      }
    });
    var reqParams = {
      page: {
        pageSize: 20,
        pageIndex: 1
      },
      billnum: "cust_customerlist",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "全部"
          },
          {
            itemName: "isDefault",
            value1: true
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 89145570,
        isExtend: true,
        simpleVOs: [
          {
            field: "merchantAppliedDetail.merchantApplyRangeId.isPotential",
            op: "eq",
            value1: false
          }
        ]
      },
      bClick: true,
      "Domain-Key": "yycrm",
      bEmptyWithoutFilterTree: true,
      serviceCode: "formalcustomer",
      treename: "aa.custcategory.CustCategory",
      ownDomain: "yycrm",
      tplid: 4061231
    };
    let hangResult = proxy1212.settle(reqParams);
    console.log(hangResult);
    return { hangResult };
  }
}
exports({ entryPoint: MyAPIHandler });