let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var saleOrder = getSaleOrderDetail({ id: param.data[0].id });
    var agentCode = getMerchant({ id: saleOrder.agentId }).code;
    var xkInfo = GetCtrlCustXkInfo({ code: agentCode });
    // 信控
    informationControl();
    // 酒标累积量
    wineLabelsCount();
    function informationControl() {
      if (saleOrder.headItem === undefined) {
        throw new Error("请维护表头自定义项!");
      }
      let define7 = saleOrder.headItem.define7; // 是否整车订单
      let define3 = saleOrder.headItem.define3; // 整车标识号
      let define5 = saleOrder.headItem.define5; // 页面中信控比例
      let define21 = saleOrder.headItem.define21; // OA审批状态
      let define42 = saleOrder.headItem.define42; // 临时账期天数
      let define43 = saleOrder.headItem.define43; // 临时信控额度
      let define40 = xkInfo.custkyed; // 可用信控额度
      let define44 = saleOrder.headItem.define44; // 临时信控比例
      let freedefine12;
      let freedefine11;
      if (saleOrder.headFreeItem !== undefined) {
        freedefine12 = saleOrder.headFreeItem.define12; // 控货支付比率
        freedefine11 = saleOrder.headFreeItem.define11; // 控货支付截止日期
      }
      //单据号
      let vbillcode = saleOrder.code;
      if (define21 === "OA审批中") {
        throw new Error("OA审批中!");
      }
      // 信控比例校验-------------------------------------------------------start
      // 收款已确认金额
      let confirmPrice = new Big(saleOrder.confirmPrice);
      let initConfirmPrice = new Big(confirmPrice);
      // 总金额
      let payMoney = new Big(saleOrder.payMoney);
      let initPayMoney = new Big(payMoney);
      // 临时信控额度
      if (define43 == undefined || define43 == null) {
        define43 = 0;
      } else {
        define43 = new Big(define43);
      }
      // 是否校验信控比例
      let isCheckControl = isCheckControlByNcc({ code: agentCode });
      if (define3 !== undefined) {
        //修改逻辑，是否整车与整车标识号脱离 230831 lkm
        if (define5 === undefined) {
          throw new Error("整车订单首付款比例为空，请联系管理员维护后下单！");
        }
        if (includes(define5, "%")) {
          throw new Error("请检查信控比例格式");
        }
        // 页面中信控比例
        define5 = new Big(define5);
        // 查询整车标识一致的所有订单 临时信控使用
        let saleOrders = getSaleOrder({
          value1: define3,
          field: "headItem.define3"
        });
        if (saleOrders !== undefined && saleOrders.length > 0) {
          //获取历史最大的临时信控
          saleOrders.forEach((orderSelf) => {
            if (orderSelf.nextStatus == "OPPOSE") {
              return;
            }
            // 临时信控额度之和
            let tmpDefine43 = orderSelf.headItem.define43;
            if (tmpDefine43 == undefined || tmpDefine43 == null) {
              tmpDefine43 = 0;
            } else {
              tmpDefine43 = new Big(tmpDefine43);
            }
            if (define43 < tmpDefine43) {
              define43 = tmpDefine43;
              define42 = orderSelf.headItem.define42;
              define44 = orderSelf.headItem.define44;
            }
            // 整单未付款金额 add by lkm
          });
          // 待修改销售订单自定义项参数
          let uSaleOrderDefineParams = [];
          //更新临时信控额度
          saleOrders.forEach((orderSelf) => {
            if (orderSelf.nextStatus == "OPPOSE") {
              return;
            }
            if (param.data[0].id === orderSelf.id) {
              //当前单据修改信控相关字段
              //临时信控额度使用金额
              let tempused = 0;
              // 临时信控额度使用金额 = 总金额 - 收款已确认金额 - 可用信控额度
              if (define43 > 0 && define40 > 0 && payMoney.minus(confirmPrice).minus(define40) > 0) {
                tempused = payMoney.minus(confirmPrice).minus(define40);
              }
              let uSaleOrderDefineParam = {
                id: orderSelf.id,
                code: orderSelf.code,
                definesInfo: [
                  {
                    define39: xkInfo.custsxed,
                    define40: xkInfo.custkyed,
                    define41: xkInfo.custyyed,
                    define42: define42,
                    define43: define43,
                    define44: define44,
                    isHead: true,
                    isFree: false
                  },
                  {
                    define10: tempused, // 更新管理端销售订单表头 自由自定义项10 为 临时信控额度本次使用金额
                    isHead: true,
                    isFree: true
                  }
                ]
              };
              uSaleOrderDefineParams.push(uSaleOrderDefineParam);
            } else {
              let uSaleOrderDefineParam = {
                id: orderSelf.id,
                code: orderSelf.code,
                definesInfo: [
                  {
                    define42: define42,
                    define43: define43,
                    define44: define44,
                    isHead: true,
                    isFree: false
                  }
                ]
              };
              uSaleOrderDefineParams.push(uSaleOrderDefineParam);
            }
          });
          if (uSaleOrderDefineParams.length > 0) {
            // 修改销售订单define
            updateSaleOrderDefine(uSaleOrderDefineParams);
          }
        }
      }
      // 未付款金额 = 总金额 - 收款已确认金额
      //未付款金额>可用标准信控额度
      //临时信控额度使用金额
      let proportion = initPayMoney == 0 ? 100 : initConfirmPrice.div(initPayMoney).times(100);
      if (isCheckControl) {
        znjOverdueByNcc({ code: agentCode, issp: "" });
        if (initPayMoney != 0 && proportion < 100) {
          if (define44 !== undefined) {
            // 临时信控比例
            if (proportion.minus(define44) < 0) {
              throw new Error("已付:" + initConfirmPrice + ";应付:" + initPayMoney + ";比例:" + proportion + ";限制的比例:" + define44);
            }
          } else if (define5 === undefined || proportion.minus(define5) < 0) {
            // 原信控比例
            throw new Error("已付:" + initConfirmPrice + ";应付:" + initPayMoney + ";比例:" + proportion + ";限制的比例:" + define5);
          }
        }
      }
      // 信控余额校验参数
      let controlOverParam = {
        vbillcode: vbillcode, //订单号
        code: agentCode, //客户编码
        total: payMoney, //总金额
        pay: confirmPrice, //收款已确认金额
        fullcode: define3, //整车标识号
        tempday: define42, //临时账期天数
        temped: define43, //临时信控额度
        tempproportion: define44, //临时信控比例
        freedefine12: freedefine12, // 控货支付比率
        freedefine11: freedefine11 // 控货支付截止日期
      };
      // 信控余额扣减--订单部分付款并且首付款比例不足100%
      if (controlOverParam.total.minus(controlOverParam.pay) != 0 && proportion < 100) {
        controlOverByNcc(controlOverParam);
      }
      // 更新管理端销售订单表头 自由自定义项10 为 临时信控额度本次使用金额
      // 更新NCC销售订单临时信控
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
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
    function getSaleOrderDetail(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error("查询销售订单异常:" + result.message);
      }
      return result.data;
    }
    function getMerchant(params) {
      let sql = "select code,name from aa.merchant.Merchant where id = '" + params.id + "'";
      let res;
      try {
        res = ObjectStore.queryByYonQL(sql, "productcenter");
      } catch (e) {
        throw new Error("查询客户档案详情(approveVerifyRule)" + e);
      }
      return res[0];
    }
    function GetCtrlCustXkInfo(params) {
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustXkInfo", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined) {
          throw new Error(JSON.stringify(result));
        }
      } catch (e) {
        throw new Error("获取NCC信控余额 " + e + ";参数:" + JSON.stringify(params));
      }
      return result.data;
    }
    function controlOverByNcc(params) {
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/DeductFacility", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined) {
          throw new Error(JSON.stringify(result));
        } else if (result.data.state !== "0") {
          throw new Error(result.data.msg);
        }
      } catch (e) {
        throw new Error("【approveVerifyRule】校验NCC信控余额 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function isCheckControlByNcc(params) {
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/CheckWhiteList", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined) {
          throw new Error(JSON.stringify(result));
        } else if (result.data.result === "0") {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        throw new Error("获取NCC信控白名单 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function znjOverdueByNcc(params) {
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/ZnjOverdue", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined) {
          throw new Error(JSON.stringify(result));
        } else if (result.data.state !== "0") {
          throw new Error(result.data.msg);
        }
      } catch (e) {
        throw new Error("NCC滞纳金校验 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function wineLabelsCount() {
      let wineLabelCodeAndName = saleOrder.headItem.define48;
      if (wineLabelCodeAndName == "" || wineLabelCodeAndName == undefined) {
        return;
      }
      let wineLabelCode = wineLabelCodeAndName.split("+")[0];
      let operCount = new Big(0);
      let productIds = [];
      saleOrder.orderDetails.forEach((self) => {
        productIds.push(self.productId);
      });
      let materialInfos = getMaterialInfos(productIds);
      let productId2ManageClass = {};
      materialInfos.forEach((self) => {
        productId2ManageClass[self.id] = self.manageClass_Name;
      });
      saleOrder.orderDetails.forEach((self) => {
        // 服务类过滤
        if (productId2ManageClass[self.productId] == "服务类") {
          return;
        }
        operCount = operCount.plus(new Big(self.qty));
      });
      let req = {
        code: wineLabelCode,
        agentCode: agentCode,
        operCount: operCount
      };
      let res = postman("post", config.bipSelfUrl + "/General_product_cla/rest/updateLableCount?access_token=" + getAccessToken(), "", JSON.stringify(req));
      res = JSON.parse(res);
      if (res.code + "" != "200") {
        throw new Error("修改酒标累积量失败:" + res.message);
      }
    }
    function updSoTmpCtrlToNcc(params) {
      let result = postman("post", config.nccUrl + "/servlet/updSoTmpCtrl", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" !== "200") {
          throw new Error(result.msg);
        }
      } catch (e) {
        throw new Error("更新NCC销售订单临时信控 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function updateSaleOrderDefine(params) {
      let reqBody = {
        billnum: "voucher_order",
        datas: params
      };
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("销售自定义项更新 " + e);
      }
    }
    function getMaterialInfos(param) {
      let req = { data: { id: param } };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(req));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("物料档案批量详情查询异常:" + res.message + ";参数[" + param + "]");
      }
      return res.data.recordList;
    }
  }
}
exports({ entryPoint: MyTrigger });