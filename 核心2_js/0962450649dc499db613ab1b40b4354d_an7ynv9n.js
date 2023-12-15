let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    throw new Error(JSON.stringify(param));
    function saleOrderSaveByNcc(saleorder) {
      let bodyParams = { data: saleorder };
      var saveOrder = postman("post", "https://ncc-test.49icloud.com:8080/servlet/saveSaleOrder", "", JSON.stringify(bodyParams));
      // 转为JSON对象
      saveOrder = JSON.parse(saveOrder);
      // 返回信息校验
    }
  }
}
exports({ entryPoint: MyTrigger });