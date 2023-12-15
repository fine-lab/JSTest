let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    return { code: 200 };
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    // 待修改销售订单自定义项参数
    var updateSaleOrderDefineParam = [];
    request.data.forEach((self) => {
      // 根据code获取id
      let reqBody = {
        pageIndex: "1",
        pageSize: "10",
        code: self.code,
        isSum: true
      };
      let saleOrders = getSaleOrderData(reqBody);
      if (saleOrders === undefined || saleOrders.length < 1) {
        throw new Error("未查询到订单");
      }
      let tmpParam = {
        id: saleOrders[0].id,
        code: self.code,
        definesInfo: [
          {
            define25: self.define,
            isHead: true,
            isFree: false
          }
        ]
      };
      updateSaleOrderDefineParam.push(tmpParam);
      if (updateSaleOrderDefineParam.length > 20) {
        // 修改销售订单define
        updateSaleOrderDefine();
        updateSaleOrderDefineParam = [];
      }
    });
    if (updateSaleOrderDefineParam.length > 0) {
      // 修改销售订单define
      updateSaleOrderDefine();
    }
    return { code: 200, data: [], message: "成功" };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrderData(params) {
      // 响应信息
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(params));
      // 转为JSON对象
      saleOrderData = JSON.parse(saleOrderData);
      // 返回信息校验
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常:" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined) {
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function updateSaleOrderDefine() {
      // 封装请求参数
      let reqBody = {
        billnum: "voucher_order",
        datas: updateSaleOrderDefineParam
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
  }
}
exports({ entryPoint: MyAPIHandler });