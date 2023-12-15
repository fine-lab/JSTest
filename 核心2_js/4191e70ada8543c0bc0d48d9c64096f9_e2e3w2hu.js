let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 物料档案详情查询
    var AppCode = "ST";
    var productListUrl = "https://www.example.com/" + "?id=" + request.material_id + "&orgId=1679109029192269832";
    var product_Assis = JSON.parse(openLinker("GET", productListUrl, AppCode, null));
    if (product_Assis.code == "200") {
      var product_AssisMain = "0";
      if (product_Assis.data.productAssistUnitExchanges != undefined && product_Assis.data.productAssistUnitExchanges != null) {
        // 辅计量
        for (var i = 0; product_Assis.data.productAssistUnitExchanges.length > i; i++) {
          if (product_Assis.data.productAssistUnitExchanges[i].assistUnit == "2333808277246208") {
            product_AssisMain = product_Assis.data.productAssistUnitExchanges[i].assistUnitCount;
            break;
          }
        }
      }
      return { product_AssisMain };
    } else {
      let result = 1;
      return { result };
    }
  }
}
exports({ entryPoint: MyAPIHandler });