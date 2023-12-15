let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = param.data[0];
    var accessToken;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    let saleorder = getSaleOrderDetail({ id: requestData.id });
    if (saleorder.id === undefined) {
      return;
    }
    //审批通过后回写新开门店数量
    writeBackStoreNum(saleorder);
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrderDetail(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error("查询销售订单异常:" + result.message);
      }
      return result.data;
    }
    function writeBackStoreNum(saleorder) {
      let details = saleorder.orderDetails;
      let accesstoken = getAccessToken();
      let orderCode = saleorder.code;
      for (var prop of details) {
        let productid = prop.productId;
        let num = prop.priceQty;
        let storeid = saleorder.headItem.define60;
        if (storeid == undefined || storeid == "") {
          return;
        }
        let req = {
          storeid: storeid,
          productid: productid,
          num: num,
          isAudit: true,
          orderCode: orderCode
        };
        var res = postman("post", config.bipSelfUrl + "/General_product_cla/rest/afterOrderAuditWriteBack?access_token=" + accesstoken, "", JSON.stringify(req));
        res = JSON.parse(res);
        if (res.code != "200") {
          throw new Error("新开门店商品已使用数量回写异常:" + res.message);
        }
      }
      return res;
    }
  }
}
exports({ entryPoint: MyTrigger });