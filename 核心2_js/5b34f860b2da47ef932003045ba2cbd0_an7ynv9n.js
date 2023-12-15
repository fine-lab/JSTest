let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 订单数据：订货门户requestData为字符串,openApi进来是JSON
    try {
      var requestData = param.requestData.orderDetails === undefined ? JSON.parse(jsonParseBefore(param.requestData)) : JSON.parse(jsonParseBefore(JSON.stringify(param.requestData)));
    } catch (e) {
      // 变更单不走该逻辑
      return;
    }
    if ((requestData["headItem!define13"] !== undefined && requestData["headItem!define13"] !== "") || requestData["_status"] !== "Insert") {
      // 拆单后的单据不继续拆单
      return;
    }
    if (
      param.realModelData !== undefined &&
      param.realModelData.length > 0 &&
      param.realModelData[0].headItem !== undefined &&
      param.realModelData[0].headItem.length > 0 &&
      param.realModelData[0].headItem[0].define13 !== undefined
    ) {
      // 修改时拆单后的单据不继续拆单
      return;
    }
    // 订单编号
    var billCode = param.data[0].code;
    // 订单表体数据
    var orderDetails = requestData.orderDetails;
    // 获取token用来访问openApi接口
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    splitingRule();
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function splitingRule() {
      // 根据组织ID获取分单规则数据
      var allSplitingRule = postman(
        "post",
        config.bipSelfUrl + "/General_product_cla/General_product_clas/spliting/list?access_token=" + getAccessToken(),
        "",
        JSON.stringify({ orgId: requestData.salesOrgId })
      );
      // 转为JSON对象
      allSplitingRule = JSON.parse(allSplitingRule);
      // 返回信息校验
      if (allSplitingRule.code != "200") {
        throw new Error("分单规则api异常:" + allSplitingRule.message);
      }
      // 分单规则列表数据
      if (allSplitingRule.data === undefined || allSplitingRule.data.enable === undefined || allSplitingRule.data.enable !== 1) {
        // 分单规则未启用
        return;
      }
      // 分单规则表头默认交易类型
      var defTranCode = allSplitingRule.data.defTranCode;
      let defTranId = extrequire("SCMSA.saleOrderRule.getTranstypeId").execute({ defTranCode: defTranCode });
      requestData.transactionTypeId = defTranId;
      // 创建人
      requestData.creator = param.return.creator;
      requestData.creatorId = param.return.creatorId;
      // 分单规则列表数据
      var splitingRuleData = allSplitingRule.data.materials;
      if (splitingRuleData === undefined) {
        return;
      }
      // 物料ID对应分单规则ID
      var productId2TransCode = new Map();
      splitingRuleData.forEach((self) => {
        productId2TransCode.set(self.shangpin, self.transCode);
      });
      var splitId2Detail = new Map();
      var previousTransCode;
      // 整车标识时不允许预售和(大单/定制)交易类型同时下单
      // 是否预售
      var isPre = requestData["headItem!define9"] === "是" ? true : false;
      // 是否整车
      var isWholeCar = requestData["headItem!define7"] === "是" ? true : false;
      // 是否(常规定制/大单定制)交易类型
      var isCompareTransCode = false;
      var taxId;
      orderDetails.forEach((self) => {
        let transCode;
        // 物返特定交易类型
        if (self.rebateReturnProductId !== undefined) {
          transCode = "30-07";
          self.unitExchangeTypePrice = 0;
          self.unitExchangeType = 0;
          if (taxId === undefined) {
            taxId = getTaxrateIdByCode({ code: "CN01" });
          }
          self.taxId = taxId;
        } else {
          // 订单表体对应交易类型编码
          transCode = productId2TransCode.get(self.productId + "");
          if (transCode == undefined) {
            transCode = defTranCode;
          }
          if (transCode === "30-Cxx-014" || transCode === "30-Cxx-015") {
            isCompareTransCode = true;
          }
          if (self.orderProductType === "GIFT") {
            transCode = previousTransCode;
          } else {
            previousTransCode = transCode;
          }
        }
        let tmpDetail = splitId2Detail.get(transCode);
        if (tmpDetail === undefined) {
          tmpDetail = [self];
        } else {
          tmpDetail.push(self);
        }
        // 后续map-key改为交易类型编码
        splitId2Detail.set(transCode, tmpDetail);
      });
      if (isWholeCar && isPre && isCompareTransCode) {
        throw new Error("整车业务时不允许预售和(大单/定制)交易类型同时下单");
      }
      // 记录拆单数量
      var splitId2DetailLen = 0;
      var splitOrders = [];
      splitId2Detail.forEach((value, key) => {
        // 表头交易类型
        let transactionTypeId = extrequire("SCMSA.saleOrderRule.getTranstypeId").execute({ code: key, defTranCode: defTranCode });
        if (key === "30-07") {
          // 物返销售订单
          splitOrders.push(JSON.parse(JSON.stringify(requestData)));
          // 交易类型
          splitOrders[splitOrders.length - 1].transactionTypeId = transactionTypeId;
          // 预售最早发货时间清空
          splitOrders[splitOrders.length - 1]["headItem!define26"] = undefined;
          // 赋值对应表体
          splitOrders[splitOrders.length - 1].orderDetails = value;
          // 含有定制交易类型时，其它商品备注清空
          if (isCompareTransCode) {
            splitOrders[splitOrders.length - 1].memo = "";
          }
          // 拆单数量
          splitId2DetailLen++;
          return;
        }
        let preDetails = [];
        let defDetails = [];
        //该销售订单是否存在预售
        var ysflag = false;
        value.forEach((v) => {
          if (v["bodyItem!define1"] === "是") {
            // 预售销售订单
            preDetails.push(v);
            //明细行中存在预售
            ysflag = true;
          } else {
            //过滤促销品
            if (v["bodyItem!define9"] != "促销品" || ysflag) {
              // 普通销售订单
              defDetails.push(v);
            }
          }
        });
        // 预售订单
        if (preDetails.length > 0) {
          splitOrders.push(JSON.parse(JSON.stringify(requestData)));
          // 去掉物返集合
          splitOrders[splitOrders.length - 1].productRebateRecords = undefined;
          // 交易类型
          splitOrders[splitOrders.length - 1].transactionTypeId = transactionTypeId;
          // 赋值对应表体
          splitOrders[splitOrders.length - 1].orderDetails = preDetails;
          // 含有定制交易类型时，其它商品备注清空
          if (isCompareTransCode) {
            splitOrders[splitOrders.length - 1].memo = "";
          }
          // 拆单数量
          splitId2DetailLen++;
        }
        // 普通订单
        if (defDetails.length > 0) {
          splitOrders.push(JSON.parse(JSON.stringify(requestData)));
          // 预售最早发货时间清空
          splitOrders[splitOrders.length - 1]["headItem!define26"] = undefined;
          // 去掉物返集合
          splitOrders[splitOrders.length - 1].productRebateRecords = undefined;
          // 交易类型
          splitOrders[splitOrders.length - 1].transactionTypeId = transactionTypeId;
          // 赋值对应表体
          splitOrders[splitOrders.length - 1].orderDetails = defDetails;
          // 含有定制交易类型时，其它商品备注清空
          if (isCompareTransCode) {
            splitOrders[splitOrders.length - 1].memo = "";
          }
          // 拆单数量
          splitId2DetailLen++;
        }
      });
      // 长度为1时未拆单，直接保存
      if (splitId2DetailLen <= 1) {
        return;
      }
      // 获取币种信息
      let currency = getCurrency({
        id: requestData["orderPrices!currency"]
      });
      let pricedigit = currency.pricedigit;
      // 重新计算表头金额等数据
      splitOrders.forEach((self, index) => {
        let splitDetails = self.orderDetails;
        // 合计含税金额
        let payMoney = 0,
          // 本币税额
          totalNatTax = 0,
          // 税额
          totalOriTax = 0,
          particularlyMoney = 0,
          // 返利金额
          rebateMoney = 0;
        self.rebateFlag = false;
        self.rebateValidFlag = false;
        // 表头重新赋值
        self["headItem!define13"] = billCode;
        // 单据号
        self.code = billCode + "-" + (index + 1);
        // 唯一key值
        self.resubmitCheckKey = self.code + S4();
        // 返利表体详情
        let rebateDetails = [];
        let rebateIdKey = "";
        // 返利rebateRecords金额
        let rebateId2UsedMoney = {};
        let salePrice_orig_taxfree = 0;
        // 循环表体计算金额总和
        splitDetails.forEach((detail) => {
          detail["firstupcode"] = self.code;
          detail["code"] = self.code;
          detail["orderDetailPrices!code"] = self.code;
          // 是否预售
          if (detail["bodyItem!define1"] === "是") {
            self["headItem!define9"] = "是";
          } else {
            detail["bodyItem!define1"] = "否";
            self["headItem!define9"] = "否";
          }
          // 返利标识，走组装的返利数据
          // 合计含税金额累加
          payMoney += detail.oriSum;
          // 特殊优惠
          particularlyMoney += detail.particularlyMoney;
          // 本币税额
          totalNatTax += detail.natTax;
          // 税额
          totalOriTax += detail.oriTax;
          // 返利金额累加
          if (detail.rebateMoney > 0) {
            rebateIdKey += detail.idKey + ";";
            rebateMoney += detail.rebateMoney;
          }
          if (detail["orderDetailPrices!salePrice_orig_taxfree"] != undefined) {
            salePrice_orig_taxfree = salePrice_orig_taxfree + detail["orderDetailPrices!salePrice_orig_taxfree"];
          }
        });
        // 表头重新赋值
        // 返利金额
        self.rebateMoney = MoneyFormatReturnBd(rebateMoney, pricedigit);
        if (self["orderPrices!wholeDiscountRate"] !== undefined) {
          self["orderPrices!wholeDiscountRate"] = MoneyFormatReturnBd(self["orderPrices!wholeDiscountRate"], pricedigit);
        }
        if (self["orderPrices!totalMoneyOrigTaxfree"] != undefined) {
          self["orderPrices!totalMoneyOrigTaxfree"] = MoneyFormatReturnBd(salePrice_orig_taxfree, pricedigit);
        }
        payMoney = MoneyFormatReturnBd(payMoney, pricedigit);
        // 合计含税金额
        self.payMoney = payMoney;
        // 应收金额
        self.realMoney = payMoney;
        // 商品应付金额
        self.orderRealMoney = payMoney;
        // 特殊优惠
        self.particularlyMoney = particularlyMoney;
        self["orderPrices!payMoneyDomestic"] = payMoney;
        self["orderPrices!orderPayMoneyDomestic"] = payMoney;
        // 本币税额
        self["orderPrices!totalOriTax"] = totalNatTax;
        // 税额
        self["orderPrices!totalNatTax"] = totalOriTax;
        // 合计含税金额-本币税额
        let taxfree = payMoney - totalNatTax;
        taxfree = MoneyFormatReturnBd(taxfree, pricedigit);
        self["orderPrices!payMoneyOrigTaxfree"] = taxfree;
        self["orderPrices!orderPayMoneyOrigTaxfree"] = taxfree;
        self["orderPrices!payMoneyDomesticTaxfree"] = taxfree;
        self["orderPrices!orderPayMoneyDomesticTaxfree"] = taxfree;
        // 交易类型编码
        // 常规定制产品销售订单	30-Cxx-014	fefc92f8-d108-11ed-9896-6c92bf477043
        // 标准产品销售订单	30-Cxx-022	b1d767f7-d104-11ed-9896-6c92bf477043
        // 大单定制产品销售订单	30-Cxx-015	2846d98f-d109-11ed-9896-6c92bf477043
        // 公共项目销售订单	30-Cxx-030	8a85de1a-d109-11ed-9896-6c92bf477043
        let tran2bizFlow = {
          "30-Cxx-014": "fefc92f8-d108-11ed-9896-6c92bf477043",
          "30-Cxx-022": "b1d767f7-d104-11ed-9896-6c92bf477043",
          "30-Cxx-015": "2846d98f-d109-11ed-9896-6c92bf477043",
          "30-Cxx-030": "8a85de1a-d109-11ed-9896-6c92bf477043"
        };
        let transactionTypeId_code = "";
        param.data[0].orderDetails.forEach((self) => {
          if (self["bodyItem!define9"] != "促销品") {
            transactionTypeId_code = productId2TransCode.get(self.productId + "");
          }
        });
        if (transactionTypeId_code == undefined) {
          throw new Error("订单中存在未定义分单规则的商品，请先维护分单规则");
        }
        self["transactionTypeId_code"] = transactionTypeId_code;
        self["bizFlow"] = tran2bizFlow[transactionTypeId_code];
        // 返利
        if (self.rebateMoney > 0 && self.rebateDetails.length > 0) {
          self.rebateDetails.forEach((s, i) => {
            if (includes(rebateIdKey, s.orderDetailIdKey)) {
              rebateDetails.push(s);
              if (rebateId2UsedMoney[s.rebateId] === undefined) {
                rebateId2UsedMoney[s.rebateId] = s.orderRebateMoney;
              } else {
                rebateId2UsedMoney[s.rebateId] += s.orderRebateMoney;
              }
            }
          });
          // 返利表体详情
          self.rebateDetails = rebateDetails;
          if (rebateDetails.length > 0) {
            // 返利金额计算
            if (self.rebateRecords !== undefined && self.rebateRecords.length > 0) {
              self.rebateFlag = true;
              self.rebateValidFlag = true;
              self.rebateRecords.forEach((rebateRecordsSelf) => {
                if (rebateId2UsedMoney[rebateRecordsSelf.rebateId] === undefined) {
                  rebateRecordsSelf.usedMoney = 0;
                } else {
                  rebateRecordsSelf.usedMoney = MoneyFormatReturnBd(rebateId2UsedMoney[rebateRecordsSelf.rebateId], pricedigit);
                }
              });
            }
          }
        } else {
          self.rebateDetails = [];
          self.rebateRecords = [];
        }
        saleOrderSaveByNcc(self);
        // 同步保存，未回写原单状态为已取消
      });
    }
    function saleOrderSave(saleorder) {
      let bodyParams = { data: saleorder };
      var saveOrder = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(bodyParams));
      // 转为JSON对象
      saveOrder = JSON.parse(saveOrder);
      // 返回信息校验
      if (saveOrder.code != "200") {
        throw new Error("保存销售订单异常[saleOrderSplitRule]:" + JSON.stringify(saveOrder.message));
      }
    }
    function saleOrderSaveByNcc(saleorder) {
      let bodyParams = { data: saleorder };
      var saveOrder = postman("post", config.nccUrl + "/servlet/saveSaleOrder", "", JSON.stringify(bodyParams));
      try {
        saveOrder = JSON.parse(saveOrder);
        if (saveOrder.code != "200") {
          throw new Error("NCC服务异常:" + saveOrder);
        }
      } catch (e) {
        throw new Error("NCC服务异常:" + saveOrder);
      }
    }
    function getTaxrateIdByCode(params) {
      var result = postman("get", "https://www.example.com/" + getAccessToken() + "&code=" + params.code, "", "");
      try {
        result = JSON.parse(result);
        if (result.code !== "200") {
          throw new Error(result.message);
        } else if (result.data === undefined || result.data.id === undefined) {
          throw new Error("根据[" + params.code + "]未查询到税率");
        }
      } catch (e) {
        throw new Error("获取税率 " + e);
      }
      return result.data.id;
    }
    function getCurrency(params) {
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
        throw new Error("查询币种信息 " + e + "[" + params.id + "]");
      }
      return result.data;
    }
  }
}
exports({ entryPoint: MyTrigger });