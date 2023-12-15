let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var accessToken;
    if (request.agentId === undefined || request.wholeCar === undefined) {
      throw new Error("客户ID或整车标识号不能为空");
    }
    // 待修改销售订单自定义项参数
    var updateSaleOrderDefineParam = [];
    // 根据客户编码与整车标识号查询所有订单
    var saleOrders = getSaleOrderData({
      agentId: request.agentId,
      wholeCar: request.wholeCar
    });
    if (saleOrders !== undefined && saleOrders.length > 0) {
      saleOrders.forEach((self) => {
        let tmpParam = {
          id: self.id,
          code: self.code,
          definesInfo: [
            {
              define21: "OA审批中",
              isHead: true,
              isFree: false
            }
          ]
        };
        updateSaleOrderDefineParam.push(tmpParam);
      });
    }
    // 修改销售订单define21，OA审批状态
    updateSaleOrderDefine();
    return { code: 200, data: [] };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderSplitRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrderData(params) {
      // 封装请求参数
      let reqBody = {
        pageIndex: "1",
        pageSize: "100",
        nextStatusName: "CONFIRMORDER",
        isSum: true,
        simpleVOs: [
          {
            op: "eq",
            value1: params.agentId,
            field: "agentId"
          },
          {
            op: "eq",
            value1: params.wholeCar,
            field: "headItem.define3"
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