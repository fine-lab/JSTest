let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var batchNumber = "" + request.importSubtable["生产批号/序列号"];
    var productCode = "" + request.importSubtable.产品编码;
    //查询产品信息表
    var objectSon = { product_coding: productCode };
    var resSon = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", objectSon);
    if (resSon.length != 0) {
    } else {
      return { err: "出库单明细" + code + "产品信息不存在，请建立产品首营信息后进行导入" };
    }
    var boolean = "true";
    return { boolean };
  }
}
exports({ entryPoint: MyAPIHandler });