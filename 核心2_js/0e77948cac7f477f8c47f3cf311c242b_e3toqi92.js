let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //切分物料字符串位数组
    var productInsertArr = [];
    var productArr = request.productArr;
    var yhtuserId = request.yhtuserId;
    var time = request.time;
    for (let i = 0; i < productArr.length; i++) {
      let productInsert = { product: productArr[i], yhtuserId: yhtuserId, time: time };
      productInsertArr.push(productInsert);
    }
    var res = ObjectStore.insertBatch("GT2152AT10.GT2152AT10.tem_product", productInsertArr, "14d5f4a2");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });