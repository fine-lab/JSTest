let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //物料档案详情查询
    var AppCode = "ST";
    var productListUrl = "https://www.example.com/" + "?id=" + request.parms + "&orgId=1679109029192269832";
    var product_Assis = JSON.parse(openLinker("GET", productListUrl, AppCode, null));
    var product_Assis_data = product_Assis.data;
    var product_AssisMain = parseFloat(0);
    if (!product_Assis_data.productAssistUnitExchanges || product_Assis_data.productAssistUnitExchanges == undefined) {
      var product_AssisMain = 1;
      return { product_AssisMain };
    }
    //遍历计量中的辅计量单位，是千克的话，就取出来
    console.log(`product_Assis_data --- ${JSON.stringify(product_Assis_data)}`);
    if (product_Assis_data.productAssistUnitExchanges.length > 0) {
      for (var i = 0; i < product_Assis_data.productAssistUnitExchanges.length; i++) {
        if (product_Assis_data.productAssistUnitExchanges[i].assistUnit_Name != "千克") {
          continue;
        } else {
          product_AssisMain = product_Assis_data.productAssistUnitExchanges[i].assistUnitCount;
        }
      }
    }
    return { product_AssisMain };
  }
}
exports({ entryPoint: MyAPIHandler });