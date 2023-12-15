let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productId = request.productId;
    //物料编码
    let productCodeValue = request.productCode;
    //柱镜
    let free1Value = request.free1;
    //球镜
    let free2Value = request.free2;
    var querySql = "select id from pc.product.ProductSKU where productId='" + productId + "' and free1='" + free1Value + "' and free2='" + free2Value + "'";
    var res = ObjectStore.queryByYonQL(querySql, "productcenter");
    if (res.length == 0) {
      let specsValue = "柱镜:" + free1Value + ";球镜:" + free2Value;
      let codeValue = "" + free2Value + free1Value + "-0000";
      let bodyValue = { productId_code: productCodeValue, specs: specsValue, code: codeValue, productSkuDetailNew: { status: false, ustatus: false, stopstatus: false } };
      let body = new Array();
      body.push(bodyValue);
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT80266AT1", JSON.stringify(body));
      let apiResponseRes = JSON.parse(apiResponse);
      if (apiResponseRes.code == "200") {
        let dataRes = apiResponseRes.data;
        if (dataRes.sucessCount != "1") {
          let errorMessage = dataRes.messages[0];
          throw new Error(errorMessage);
        }
      } else {
        throw new Error(apiResponseRes.message);
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });