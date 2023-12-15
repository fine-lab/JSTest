let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var rows = request.rows;
    var items = [];
    for (var i = 0; i < rows.length; i++) {
      var param1 = {
        OB: "OB",
        //商品名称
        productName: rows[i].productCode,
        //销售价格
        productCode: rows[i].productName,
        //无税单价
        oriUnitPrice: rows[i].oriUnitPrice
      };
      items.push(param1);
    }
    //请求地址
    let url = "https://s58g509438.goho.co:443/csv";
    //头部信息
    let header = {
      //提交格式
      "Content-Type": "application/json;charset=UTF-8"
    };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(items));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });