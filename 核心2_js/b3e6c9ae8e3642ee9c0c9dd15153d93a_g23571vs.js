let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var merchant = request.merchant;
    var merchantCode = request.merchantCode;
    var merchantApplyRangeId = request.merchantApplyRangeId;
    let url = "https://www.example.com/";
    let body = {
      pageIndex: "1",
      pageSize: "500",
      isSum: "false",
      simpleVOs: [
        {
          op: "eq",
          value1: merchant,
          field: "agentId"
        }
      ]
    };
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    var salesOrderResult = JSON.parse(apiResponse);
    var resultList = salesOrderResult.data.recordList;
    if (salesOrderResult.data.pageCount > 1) {
      for (var i = 2; i <= salesOrderResult.data.pageCount; i++) {
        let url = "https://www.example.com/";
        let body = {
          pageIndex: i.toString(),
          pageSize: "500",
          isSum: "false",
          simpleVOs: [
            {
              op: "eq",
              value1: merchant,
              field: "agentId"
            }
          ]
        };
        let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
        var result = JSON.parse(apiResponse);
        result.data.recordList.forEach((item) => {
          resultList.push(item);
        });
      }
    }
    return { res: resultList };
  }
}
exports({ entryPoint: MyAPIHandler });