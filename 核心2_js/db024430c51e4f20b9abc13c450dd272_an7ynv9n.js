let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    var storeid = data["headItem!define60"];
    var productid = data.orderDetails[0].productId;
    var orderCode = data.orderDetails[0].code;
    var closedRowCount = data.orderDetails[0].subQty - data.orderDetails[0].sendQty;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    //新开门店回写
    writeBackStoreNum();
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function writeBackStoreNum() {
      if (storeid == undefined || storeid == "") {
        return;
      }
      let req = {
        storeid: storeid,
        productid: productid,
        closedRowCount: closedRowCount,
        isClosed: false,
        orderCode: orderCode
      };
      var res = postman("post", config.bipSelfUrl + "/General_product_cla/rest/writeBackStoreNum?access_token=" + getAccessToken(), "", JSON.stringify(req));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("新开门店商品已使用数量回写异常:" + res.message);
      }
    }
  }
}
exports({ entryPoint: MyTrigger });