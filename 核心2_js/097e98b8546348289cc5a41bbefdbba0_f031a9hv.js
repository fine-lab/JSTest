let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data;
    var accessToken;
    data.forEach((self) => {
      // 是否整车订单
      let define7;
      // 整车标识号
      let define3;
      // 页面中信控比例
      let define5;
      let define21;
      if (self.headItem === undefined || self.headItem.define7 === undefined) {
        // 批量审核时目前没有自定义项，需要先查询一下订单
        let saleOrders = getSaleOrder({
          value1: self.code,
          field: "code"
        });
        if (saleOrders !== undefined && saleOrders.length > 0) {
          if (saleOrders[0].headItem === undefined) {
            throw new Error("请维护表头自定义项!");
          }
          // 整车标识号
          define3 = saleOrders[0].headItem.define3;
          // 页面中信控比例
          define5 = saleOrders[0].headItem.define5;
          // 是否整车订单
          define7 = saleOrders[0].headItem.define7;
          define21 = saleOrders[0].headItem.define21;
        }
      } else {
        // 整车标识号
        define3 = self.headItem.define3;
        // 页面中信控比例
        define5 = self.headItem.define5;
        // 是否整车订单
        define7 = self.headItem.define7;
        define21 = self.headItem.define21;
      }
      if (define21 === "OA审批中") {
        throw new Error("OA审批中!");
      }
      // 整车业务-------------------------------------------------------start
      // 收款已确认金额
      let confirmPrice = new Big(0);
      // 总金额
      let payMoney = new Big(0);
      if (define7 === "否") {
        // 收款已确认金额
        confirmPrice = new Big(self.confirmPrice);
        // 总金额
        payMoney = new Big(self.payMoney);
        if (payMoney != 0 && confirmPrice.div(payMoney) < 1) {
          throw new Error("客户付款比例不满足信控首付款比例，不允许审核，请付款后操作 ");
        }
      } else if (define7 === "是") {
        if (define3 === undefined) {
          throw new Error("请维护整车标识号!");
        }
        if (define5 === undefined) {
          throw new Error("整车订单首付款比例为空，请联系管理员维护后下单！");
        }
        // 页面中信控比例
        define5 = new Big(define5);
        // 收款已确认金额
        let confirmPrice = new Big(0);
        // 总金额
        let payMoney = new Big(0);
        // 查询整车标识一致的所有订单
        let saleOrders = getSaleOrder({
          value1: define3,
          field: "headItem.define3"
        });
        if (saleOrders !== undefined && saleOrders.length > 0) {
          saleOrders.forEach((orderSelf) => {
            if (orderSelf.nextStatus != "OPPOSE") {
              // 收款已确认金额
              confirmPrice = confirmPrice.plus(new Big(orderSelf.confirmPrice));
              // 总金额
              payMoney = payMoney.plus(new Big(orderSelf.payMoney));
            }
          });
        }
        if (payMoney != 0 && confirmPrice.div(payMoney) < define5.div(100)) {
          throw new Error("已付:" + confirmPrice + ";应付:" + payMoney + ";比例:" + confirmPrice.div(payMoney));
        }
        // 信控余额校验
        let controlOverParam = {
          vbillcode: self.code,
          code: getMerchant({ id: self.agentId }).code,
          amount: payMoney.minus(confirmPrice)
        };
        if (controlOverParam.amount != 0) {
          getControlOverByNcc(controlOverParam);
        }
      } else {
        throw new Error("请维护[是否整车订单]!");
      }
      // 整车业务-------------------------------------------------------end
    });
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderSplitRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrder(params) {
      // 封装请求参数
      let reqBody = {
        pageIndex: "1",
        pageSize: "100",
        isSum: true,
        simpleVOs: [
          {
            op: "eq",
            value1: params.value1,
            field: params.field
          }
        ]
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      // 转为JSON对象
      result = JSON.parse(result);
      // 返回信息校验
      if (result.code != "200") {
        throw new Error("查询销售订单异常:" + result.message);
      }
      return result.data.recordList;
    }
    function getMerchant(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户档案详情 " + e);
      }
      return result.data;
    }
    function getControlOverByNcc(params) {
      // 响应信息
      let result = postman("post", "https://www.example.com/", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined) {
          throw new Error(JSON.stringify(result));
        } else if (result.data.state !== "0") {
          throw new Error(result.data.msg);
        }
      } catch (e) {
        throw new Error("校验NCC信控余额 " + e + ";参数:" + JSON.stringify(params));
      }
    }
  }
}
exports({ entryPoint: MyTrigger });