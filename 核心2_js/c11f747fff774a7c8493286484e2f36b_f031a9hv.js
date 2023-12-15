let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var accessToken;
    if (request.data === undefined || request.data.length < 1) {
      throw new Error("请正确传参");
    }
    request.data.forEach((self) => {
      if (self.inventoryOrgCode === undefined) {
        self.inventoryOrgCode = [];
      }
    });
    var nccStock = stockQueryByNcc(request);
    var matCodeToCount = {};
    nccStock.forEach((self) => {
      // 辅数量
      matCodeToCount[self.materialCode] = {
        astinventory: self.astinventory,
        vchangerate: self.vchangerate
      };
    });
    var saleOrderData = getSaleOrderData();
    // 物料现存量减去“开立”状态订单占用数量
    saleOrderData.forEach((self) => {
      if (matCodeToCount[self.productCode] !== undefined) {
        matCodeToCount[self.productCode]["astinventory"] = new Big(matCodeToCount[self.productCode]["astinventory"]).minus(self.subQty);
      }
    });
    var resData = [];
    for (let key in matCodeToCount) {
      matCodeToCount[key].materialCode = key;
      resData.push(matCodeToCount[key]);
    }
    return { code: 200, data: resData };
    function stockQueryByNcc(params) {
      var resData = postman("post", "https://www.example.com/", "", JSON.stringify(params));
      // 转为JSON对象
      try {
        resData = JSON.parse(resData);
      } catch (e) {
        throw new Error("请求NCC异常:" + resData);
      }
      // 返回信息校验
      if (resData.code != "200") {
        throw new Error("查询NCC剩余库存失败:" + resData.msg + ";参数:" + JSON.stringify(params));
      }
      return resData.data;
    }
    function getSaleOrderData() {
      // 封装请求参数
      let reqBody = {
        pageIndex: "1",
        pageSize: "500",
        isSum: false,
        nextStatusName: "CONFIRMORDER"
      };
      // 响应信息
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
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
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderSplitRule.getToken").execute().access_token;
      }
      return accessToken;
    }
  }
}
exports({ entryPoint: MyAPIHandler });