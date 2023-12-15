let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var accessToken;
    if (request.data === undefined || request.data.length < 1) {
      throw new Error("请正确传参");
    }
    // 销售组织查询库存组织
    var saleOrgId = request.saleOrgId;
    var inventoryOrgCodes = [];
    if (saleOrgId !== undefined) {
      var salesDelegateData = salesDelegates();
      salesDelegateData.forEach((self) => {
        if (self.sales_org == saleOrgId) {
          // 获取业务单元ID及CODE信息，数据少先循环查询，后续优化
          let orgInfo = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + self.inventory_org, "", "");
          orgInfo = JSON.parse(orgInfo);
          if (orgInfo.code != "200" || orgInfo.data === undefined) {
            throw new Error("查询组织详情异常:" + orgInfo.message);
          }
          inventoryOrgCodes.push(orgInfo.data.code);
        }
      });
    }
    request.data.forEach((self) => {
      if (self.inventoryOrgCode === undefined) {
        self.inventoryOrgCode = inventoryOrgCodes;
      }
    });
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var nccStock = stockQueryByNcc(request);
    var matCodeToCount = {};
    nccStock.forEach((self) => {
      // 辅数量
      matCodeToCount[self.materialCode] = {
        nccAstinventory: self.astinventory,
        astinventory: self.astinventory,
        vchangerate: self.vchangerate
      };
      let sum = 0;
      var orderres = ObjectStore.queryByYonQL(
        "select orderId.nextStatus,subQty,orderId.erpSynStatusCode from voucher.order.OrderDetail where orderId.nextStatus in('CONFIRMORDER','DELIVERGOODS') and orderId.vouchdate>='2022-04-01 00:00:00'  and  productCode='" +
          self.materialCode +
          "'",
        "udinghuo"
      );
      orderres.forEach((self) => {
        if (self.orderId_erpSynStatusCode == "200") {
          return;
        }
        sum += self.subQty;
      });
      if (matCodeToCount[self.materialCode] !== undefined) {
        matCodeToCount[self.materialCode]["astinventory"] = new Big(matCodeToCount[self.materialCode]["astinventory"]).minus(sum);
      }
    });
    // 列表
    var resData = [];
    var productCodes = [];
    for (let key in matCodeToCount) {
      matCodeToCount[key].materialCode = key;
      productCodes.push(key);
      resData.push(matCodeToCount[key]);
    }
    productPre();
    return { code: 200, data: resData };
    function productPre() {
      let productPres = extrequire("GT80750AT4.backDefaultGroup.getProductPreApi").execute({
        code: productCodes,
        deliveryTime: new Date().getTime() + 28800000
      });
      let code2Pres = {};
      if (productPres.data !== undefined) {
        productPres.data.forEach((e) => {
          code2Pres[e.code] = e;
        });
      }
      resData.forEach((e) => {
        let pres = code2Pres[e.materialCode];
        e.preCanusenum = pres === undefined ? 0 : pres.canusenum;
      });
    }
    function stockQueryByNcc(params) {
      var resData = postman("post", config.nccUrl + "/servlet/StockQueryServlet", "", JSON.stringify(params));
      // 转为JSON对象
      try {
        resData = JSON.parse(resData);
        // 返回信息校验
        if (resData.code != "200") {
          throw new Error(resData.msg);
        }
      } catch (e) {
        throw new Error("查询NCC库存 " + e + ";请求:" + JSON.stringify(params));
      }
      return resData.data;
    }
    function getSaleOrderData(params) {
      // 封装请求参数
      let reqBody = {
        pageIndex: params.pageIndex,
        pageSize: "500",
        isSum: false,
        simpleVOs: [
          {
            op: "between",
            value1: "CONFIRMORDER",
            value2: "DELIVERGOODS",
            field: "nextStatus"
          }
        ]
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
        recordCount = saleOrderData.data.recordCount;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function salesDelegates() {
      let salesDelegateParam = {
        pageIndex: "1",
        pageSize: "100"
      };
      // 响应信息
      let salesDelegate = postman(
        "post",
        "https://www.example.com/" + getAccessToken(),
        "",
        JSON.stringify(salesDelegateParam)
      );
      // 转为JSON对象
      salesDelegate = JSON.parse(salesDelegate);
      // 返回信息校验
      if (salesDelegate.code != "200" || salesDelegate.data === undefined) {
        throw new Error("查询销售委托关系列表异常:" + salesDelegate.message);
      }
      return salesDelegate.data.recordList;
    }
  }
}
exports({ entryPoint: MyAPIHandler });