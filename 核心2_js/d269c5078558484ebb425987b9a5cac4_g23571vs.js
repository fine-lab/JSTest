let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productCodeAry = request.productCodeAry;
    let url = "https://www.example.com/";
    let body = {
      pageIndex: "1",
      pageSize: "500",
      product_cCode: productCodeAry
    };
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    var result = JSON.parse(apiResponse);
    var resultList = result.data.recordList;
    if (result.data.pageCount > 1) {
      for (var i = 2; i <= result.data.pageCount; i++) {
        let url = "https://www.example.com/";
        let body = {
          pageIndex: i.toString(),
          pageSize: "500",
          product_cCode: productCodeAry
        };
        let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
        var lastResult = JSON.parse(apiResponse);
        lastResult.data.recordList.forEach((item) => {
          resultList.push(item);
        });
      }
    }
    return { res: resultList };
  }
}
exports({ entryPoint: MyAPIHandler });