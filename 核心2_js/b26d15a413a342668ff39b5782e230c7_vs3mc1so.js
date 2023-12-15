let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var path = request.path;
    var arrayList = request.arrayList;
    var List = new Array();
    let body = { pageIndex: "1", pageSize: "500", priceTemplateId: path };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT5646AT1", JSON.stringify(body));
    let apiResponse_code = JSON.parse(apiResponse);
    return { res: apiResponse_code };
    let recordList = apiResponse_code.data.recordList;
    var array = new Array();
    if (recordList.length > 0) {
      for (var i = 0; i < recordList.length; i++) {
        // 计价单位
        var amountUnit = recordList[i].amountUnit;
        // 金额
        var recordGradients_price = recordList[i].recordGradients_price;
        // 物料code
        var productId_code = recordList[i].productId_code;
        // 组织
        var orgScopeId = recordList[i].orgScopeId;
        var list = {
          amountUnit: amountUnit,
          recordGradients_price: recordGradients_price,
          productId_code: productId_code,
          orgScopeId: orgScopeId
        };
        array.push(list);
      }
    } else {
      throw new Error("未查询到调价单信息！");
    }
    return { res: array };
  }
}
exports({ entryPoint: MyAPIHandler });