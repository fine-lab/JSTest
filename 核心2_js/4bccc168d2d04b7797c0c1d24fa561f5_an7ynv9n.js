let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request === undefined || request.salesOrgId === undefined) {
      throw new Error("校验物料可用库存量:销售组织/表体为空");
    }
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    // 销售订单编码
    var code = request.code;
    // 销售组织
    var salesOrgId = request.salesOrgId;
    var orderDetails = JSON.parse(JSON.stringify(request.orderDetails));
    // 获取access_token
    var accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
    // 销售组织ID对应委托库存关系 {salesOrgId:[库存组织ID]}
    var salesOrgId2Delegate = {};
    // 组织ID与CODE对应关系
    var orgId2Code = new Map();
    // 需校验的物料
    var verifyMaterialCodes = [];
    orderDetails.forEach((self) => {
      // 保存需要校验库存的物料
      if (self.salesOrgId === null || self.salesOrgId === undefined) {
        self.salesOrgId = salesOrgId;
      }
      if (!includes(verifyMaterialCodes, self.productCode)) {
        salesOrgId2Delegate[self.salesOrgId] = [self.salesOrgId];
        orgId2Code.set(self.salesOrgId, self.salesOrgId);
        verifyMaterialCodes.push(self.productCode);
      }
    });
    if (verifyMaterialCodes.length < 1) {
      // 没有需要校验的物料
      return [];
    }
    var salesDelegateData = salesDelegates();
    salesDelegateData.forEach((self) => {
      if (salesOrgId2Delegate[self.sales_org] !== undefined && !includes(salesOrgId2Delegate[self.sales_org], self.inventory_org)) {
        orgId2Code.set(self.inventory_org, self.inventory_org);
        salesOrgId2Delegate[self.sales_org].push(self.inventory_org);
      }
    });
    orgId2Code.forEach((value, key) => {
      // 获取业务单元ID及CODE信息，数据少先循环查询，后续优化
      let orgInfo = postman("get", "https://www.example.com/" + accessToken + "&id=" + value, "", "");
      orgInfo = JSON.parse(orgInfo);
      if (orgInfo.code != "200" || orgInfo.data === undefined) {
        throw new Error("查询组织详情异常:" + orgInfo.message);
      }
      orgId2Code.set(key, orgInfo.data.code);
    });
    var stockQueryByNccParams = { data: [] };
    // 封装请求参数
    orderDetails.forEach((self) => {
      // 组织ID转为code
      let inventoryOrgCode = [];
      if (salesOrgId2Delegate[self.salesOrgId] !== undefined && includes(verifyMaterialCodes, self.productCode)) {
        salesOrgId2Delegate[self.salesOrgId].forEach((s) => {
          inventoryOrgCode.push(orgId2Code.get(s) + "");
        });
        // 请求参数 ===> {"materialCode":"","inventoryOrgCode":["",""]}
        let stockParam = {};
        // 产品编码
        stockParam.materialCode = self.productCode;
        // 组织编码
        stockParam.inventoryOrgCode = inventoryOrgCode;
        stockQueryByNccParams.data.push(stockParam);
      }
    });
    var nccStock = stockQueryByNcc(stockQueryByNccParams);
    var matCodeToCount = {};
    nccStock.forEach((self) => {
      // 辅数量
      matCodeToCount[self.materialCode] = self.astinventory;
    });
    // 列表
    var saleOrderData = [];
    // 数量
    var recordCount = 0;
    var pageIndex = 1;
    while (saleOrderData.length < recordCount || pageIndex === 1) {
      let singleList = getSaleOrderData({
        pageIndex: pageIndex
      });
      saleOrderData = saleOrderData.concat(singleList);
      pageIndex++;
    }
    // 物料现存量减去“开立”状态订单占用数量
    if (saleOrderData !== undefined && saleOrderData.length > 0) {
      saleOrderData.forEach((self) => {
        // 期初数据不占库存
        if (self.vouchdate === undefined || new Date("2022-04-01").getTime() > new Date(self.vouchdate).getTime()) {
          return;
        }
        // 订单已同步到NCC数据不计算库存
        if (self.erpSynStatusCode == "200") {
          return;
        }
        // 减去“开立”状态订单占用量
        if (matCodeToCount[self.productCode] !== undefined && self.code + "" !== code + "") {
          matCodeToCount[self.productCode] = new Big(matCodeToCount[self.productCode]).minus(self.subQty);
        }
      });
    }
    var response = [];
    // 统一订单表体行物料重复情况 --------------------------------------start
    orderDetails.forEach((self) => {
      if (includes(verifyMaterialCodes, self.productCode) && matCodeToCount[self.productCode] !== undefined) {
        // 以0为基数，计算预售数量
        let lastCount;
        if (matCodeToCount[self.productCode] < 0) {
          lastCount = new Big(0).minus(self.subQty);
        } else {
          lastCount = new Big(matCodeToCount[self.productCode]).minus(self.subQty);
        }
        // 计算总剩余库存
        matCodeToCount[self.productCode] = new Big(matCodeToCount[self.productCode]).minus(self.subQty);
        let detail = {
          idKey: self.idKey,
          lastCount: lastCount,
          productId: self.productId,
          productCode: self.productCode
        };
        response.push(detail);
      }
    });
    // 统一订单表体行物料重复情况 --------------------------------------end
    return response;
    function salesDelegates() {
      let salesDelegateParam = {
        pageIndex: "1",
        pageSize: "100"
      };
      // 响应信息
      let salesDelegate = postman("post", "https://www.example.com/" + accessToken, "", JSON.stringify(salesDelegateParam));
      // 转为JSON对象
      salesDelegate = JSON.parse(salesDelegate);
      // 返回信息校验
      if (salesDelegate.code != "200" || salesDelegate.data === undefined) {
        throw new Error("查询销售委托关系列表异常:" + salesDelegate.message);
      }
      return salesDelegate.data.recordList;
    }
    function stockQueryByNcc(params) {
      var resData = postman("post", config.nccUrl + "/servlet/StockQueryServlet", "", JSON.stringify(params));
      // 转为JSON对象
      try {
        resData = JSON.parse(resData);
        // 返回信息校验
        if (resData.code != "200") {
          throw new Error(resData.msg + ";参数:" + JSON.stringify(params));
        }
      } catch (e) {
        throw new Error("查询NCC剩余库存异常:" + resData);
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
            op: "eq",
            value1: "CONFIRMORDER",
            field: "nextStatus"
          },
          {
            op: "neq",
            value1: "200",
            field: "erpSynStatusCode"
          },
          {
            op: "gt",
            value1: "2022-04-01 00:00:00",
            field: "vouchdate"
          }
        ]
      };
      // 响应信息
      let saleOrderData = postman("post", "https://www.example.com/" + accessToken, "", JSON.stringify(reqBody));
      // 转为JSON对象
      saleOrderData = JSON.parse(saleOrderData);
      // 返回信息校验
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常(verifyInventoryApi):" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined) {
        recordCount = saleOrderData.data.recordCount;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });