let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = param.requestData[0];
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var saleOrder = getSaleOrderDetail({ id: requestData.id });
    // 封装请求参数
    var updateSaleOrderDefineParam = [];
    let tmpParam = {
      id: requestData.id,
      code: requestData.code,
      definesInfo: [
        {
          define32: "",
          isHead: true,
          isFree: false
        }
      ]
    };
    updateSaleOrderDefineParam.push(tmpParam);
    // 修改销售订单define
    updateSaleOrderDefine(updateSaleOrderDefineParam);
    //新开门店数量回写
    writeBackStoreNum();
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function updateSaleOrderDefine(params) {
      // 封装请求参数
      let reqBody = {
        billnum: "voucher_order",
        datas: params
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("销售自定义项更新 " + e);
      }
    }
    function getSaleOrderDetail(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error("查询销售订单异常(openAfterRule):" + result.message);
      }
      return result.data;
    }
    function writeBackStoreNum() {
      let storeid = saleOrder.headItem.define60;
      let details = saleOrder.orderDetails;
      let orderCode = saleOrder.code;
      for (var prop of details) {
        let productid = prop.productId;
        let closedRowCount = prop.closedRowCount;
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
      return res;
    }
  }
}
exports({ entryPoint: MyTrigger });