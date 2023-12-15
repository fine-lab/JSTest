let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //物料档案详情查询
    var AppCode = "ST";
    var productListUrl = "https://www.example.com/" + "?id=" + request.parms + "&orgId=1736590062580662273";
    var product_Assis = JSON.parse(openLinker("GET", productListUrl, AppCode, null));
    var product_AssisMain = "0";
    if (product_Assis.data.productAssistUnitExchanges != undefined && product_Assis.data.productAssistUnitExchanges != null) {
      //辅计量
      for (var i = 0; product_Assis.data.productAssistUnitExchanges.length > i; i++) {
        if (product_Assis.data.productAssistUnitExchanges[i].assistUnit == "2389073031074304") {
          product_AssisMain = (product_Assis.data.productAssistUnitExchanges[i].assistUnitCount / product_Assis.data.productAssistUnitExchanges[i].mainUnitCountNew).toString();
        }
      }
    }
    return { product_AssisMain };
  }
}
exports({ entryPoint: MyAPIHandler });