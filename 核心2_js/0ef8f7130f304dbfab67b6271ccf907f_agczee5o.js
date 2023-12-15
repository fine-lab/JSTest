let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data || [];
    data.forEach((bill) => {
      if (bill.source == 2 && bill.importFlag == 1) {
        // 填充业务员，以及部门
        fillSalesmen(bill);
        // 填充合同编码
        getSaleOrderCode(bill);
        // 保证金、信用余额填充
        fillCreditAndDepositBalance(bill);
        // 填充保证金金额
        fillRowDepositMoney(bill);
        // 交易类型编码
        transTransTYpe(bill);
        // 销售组织编码
        getOrgCode(bill);
        // 转换表头表体的自定义项
        transDefineAndOrderPrice(bill);
        // 保存前检查
        beforeSaveRule(bill);
        // 销售订单保存后规则
        afterSaveRule(bill);
      }
    });
    function checkOoriSumRowNum(bill) {
      let row1 =
        bill.orderDetails.filter(function (row) {
          return row.oriSum >= 0;
        }).length || 0;
      let row2 =
        bill.orderDetails.filter(function (row) {
          return row.oriSum < 0;
        }).length || 0;
      if (row1 > 0 && row2 > 0 && row1 + row2 > 2) {
        throw new Error("含税金额 存在正负时 表体的行只能是 一正一负 ！！！");
      }
    }
    // 保存前对订单的校验
    function beforSaveCheck(bill) {
      bill.orderDetails.forEach((i, index) => {
        i.index = index + 1;
      });
      let data = {
        params: {
          saleOrder: bill
        },
        url: "saleOrder/saveCheck",
        method: "post"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
      let res = func1.execute(data);
      return res;
    }
    function beforeSaveRule(bill) {
      checkOoriSumRowNum(bill);
      let result = beforSaveCheck(bill);
      if (result.code != "200") {
        throw new Error((result && result.message) || "请求后端失败，请联系管理员！！！");
      }
      result = result.data || {};
      // 周转天数不足检查
      bill["headFreeItem"].set("define16", result.checkCycleDay == false ? "是" : "否");
      // 信用账期不足检查
      let checkCreditPaymentList = result.checkCreditPaymentList || [];
      bill["headFreeItem"].set("define10", checkCreditPaymentList.length > 0 ? "是" : "否");
      let itemIds = checkCreditPaymentList.map((data) => data.itemId + "");
      bill.orderDetails.forEach((row) => {
        row["bodyFreeItem"].set("define21", itemIds.indexOf(row.id + "") >= 0 ? "是" : "否");
      });
      // 信用余额不足检查
      bill["headFreeItem"].set("define8", result.checkCreditBalance == false ? "是" : "否");
      // 保证金不足检查
      bill["headFreeItem"].set("define9", result.checkEarnestBalance == false ? "是" : "否");
      // 首营客户检查
      if (result.checkIsFirstMerchant == false) {
        throw new Error("首营客户检查不通过 ！！！");
      }
      // 品种经营范围检查
      if (result.checkBusinessScope == false) {
        throw new Error("品种经营范围检查不通过 ！！！");
      }
      // 客户资质效期检查
      if (result.checkMerchantQualificationList && result.checkMerchantQualificationList.length > 0) {
        let checkMerchantQualificationList = result.checkMerchantQualificationList;
        // 证照编码	vliccode 证照名称	typename 截至有效期	denddate
        throw new Error("客户资质效期检查不通过 ！！！");
      }
      // 销售订单发票限额检查
      if (result.checkInvoiceLimitMoney && result.checkInvoiceLimitMoney > 0) {
        throw new Error(`${result.index}行超过发票限额,限额为${result.checkInvoiceLimitMoney} ！！！`);
      }
      // 首营品种检查
      if (result.checkIsFirstMaterial == false) {
        throw new Error(`首营品种检查不通过 ！！！`);
      }
      // 可用量检查
      if (result.checkAvailableNum == false) {
        throw new Error(`${result.index}行 ${result.productCode}品种 可用量检查失败，可用量为${result.availableNum} ！！！`);
      }
    }
    // 销售订单保存后规则
    function afterSaveRule(bill) {
      let data = {
        params: {
          saleOrder: bill
        },
        url: "saleOrder/afterSaveRule",
        method: "post"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
      let res = func1.execute(data);
      if (res.code != "200") {
        throw new Error("销售订单保存规则执行失败！！！");
      }
    }
    // 填充业务员
    function fillSalesmen(bill) {
      let org_id = bill.salesOrgId;
      let service_org = bill.headFreeItem.define1;
      let customer = bill.agentId;
      let material = bill.orderDetails[0].productId;
      if (!(org_id && service_org && customer && material)) {
        return false;
      }
      let data = {
        params: {
          org_id: org_id,
          service_org: service_org,
          customer: customer,
          material: material
        },
        url: "saleOrder/fillSalesmen",
        method: "post"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
      let res = func1.execute(data);
      if ("200" != res.code) {
        throw new Error(res.message || "系统异常，业务员填充失败，请联系管理员！！");
      }
      let result = res.data || {};
      if (result._emptyResult) {
        throw new Error("业务员填充失败，代理商客户品种档案中未匹配到记录！！！");
        return false;
      }
      let staff_id = result.id;
      let staff_name = result.name;
      let mainJob = (result.mainJobList && result.mainJobList[0]) || {};
      let dept_id = mainJob.dept_id;
      let dept_name = mainJob.dept_id_name;
      bill.set("corpContact", staff_id);
      bill.set("corpContactUserName", staff_name);
      bill.set("saleDepartmentId", dept_id);
      bill.set("saleDepartmentId_name", dept_name);
    }
    // 获取合同编码
    function getSaleOrderCode(bill) {
      let corpContact = bill.corpContact;
      let agentId = bill.agentId;
      let agentRelationId = bill.agentRelationId;
      if (!corpContact) {
        throw new Error("合同编码填充失败：客户为空，请先填写客户");
      }
      if (!agentId) {
        throw new Error("合同编码填充失败：客户为空，请先填写客户");
      }
      if (!agentId) {
        throw new Error("合同编码填充失败：客户为空，请先填写客户");
      }
      let data = {
        params: {
          staffId: corpContact + "",
          customerId: agentId + "",
          merchantApplyRangeId: agentRelationId + ""
        },
        url: "saleOrder/getSaleOrderCode",
        method: "post"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
      let res = func1.execute(data);
      if ("200" != res.code) {
        throw new Error(res.message || "系统异常，合同编码填充失败，请联系管理员！！");
      }
      res = res.data || {};
      bill["headFreeItem"].set("define13", res.SaleOrderCode || "");
    }
    // 表头保证金、信用余额填充
    function fillCreditAndDepositBalance(bill) {
      let org_id = bill.salesOrgId;
      let service_org = bill.headFreeItem.define1;
      if (!(org_id && service_org)) {
        return false;
      }
      let data = {
        params: {
          orgId: org_id,
          serviceOrg: service_org
        },
        url: "saleOrder/getDepositAndCreditBalance",
        method: "post"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
      let res = func1.execute(data);
      if ("200" != res.code) {
        throw new Error(res.message || "系统异常，保证金、信用余额填充失败，请联系管理员！！");
      }
      let { earnestBalance, cerditBalance } = res.data || {};
      // 保证金余额
      bill["headFreeItem"].set("define17", (earnestBalance || 0) + "");
      // 信用余额
      bill["headFreeItem"].set("define11", (cerditBalance || 0) + "");
    }
    // 表体保证金金额计算
    function fillRowDepositMoney(bill) {
      // 保证金金额计算：根据销售组织+代理商+品种+日期匹配“商品底价”表获得品种对应的底价；
      // 当笔交易订单各行所需保证金金额的计算公式为“底价*销售数量+（含税成交价-底价）*税点*销售数量”D
      // 如果为 冬储 的 保证金减半
      let dongchu = bill.headFreeItem.define20 || false;
      bill["headFreeItem"].set("define20", dongchu);
      let rows = bill.orderDetails || [];
      if (rows.length < 1) {
        throw new Error("销售订单表体不能为空！！！");
      }
      rows.forEach((row) => {
        let floorPrice = new Big(row["bodyFreeItem"]["define1"] || 0); // 底价
        let subQty = new Big(row.subQty || 0); // 销售数量
        let oriTaxUnitPrice = new Big(row.oriTaxUnitPrice || 0); // 含税成交价
        let taxRate = new Big(row["bodyFreeItem"]["define2"] || 1); // 底价税点
        let depositMoney = floorPrice.times(subQty).plus(oriTaxUnitPrice.minus(floorPrice)).times(subQty).times(taxRate).times(0.01);
        if (dongchu == "true") {
          depositMoney = depositMoney.times(0.5);
        }
        row["bodyFreeItem"].set("define4", depositMoney + "");
      });
    }
    // 查询交易类型编码
    function transTransTYpe(bill) {
      let transTypeId = bill.transactionTypeId || "";
      let data = {
        params: {
          codes: ["SCMSA1"]
        },
        url: "yonbip/digitalModel/transtype/queryByBillTypeCodes",
        method: "post"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.ComOpenApiUtil");
      let res = func1.execute(data);
      if ("200" != res.code) {
        throw new Error(res.message || "销售订单交易类型查询失败，请联系管理员！！");
      }
      let { code, data: data1 } = res;
      if (code == "200" && data1.length > 0) {
        let transtypes = data1[0]["data"] || [];
        let transFlag = false;
        transtypes.forEach((item) => {
          if (transTypeId == item.id) {
            bill["transactionTypeId_code"] = item.code;
            transFlag = true;
            return false;
          }
        });
        if (!transFlag) {
          throw new Error("未匹配到交易类型code");
        }
      }
    }
    // 转换表头表体的自定义项
    function transDefineAndOrderPrice(bill) {
      Object.keys(bill.headFreeItem).forEach((k) => {
        bill["headFreeItem!" + k] = bill.headFreeItem[k];
      });
      bill.orderDetails.forEach((orderDetail) => {
        Object.keys(orderDetail.bodyFreeItem).forEach((k) => {
          orderDetail["bodyFreeItem!" + k] = orderDetail.bodyFreeItem[k];
        });
      });
      Object.keys(bill.orderPrices).forEach((k) => {
        bill["orderPrices!" + k] = bill.orderPrices[k];
      });
    }
    // 获取销售组织编码-
    function getOrgCode(bill) {
      let data = {
        params: {
          id: bill.salesOrgId
        },
        url: "yonbip/digitalModel/orgunit/detail",
        method: "get"
      };
      let func1 = extrequire("SCMSA.backDefaultGroup.ComOpenApiUtil");
      let res = func1.execute(data);
      if ("200" != res.code) {
        throw new Error(res.message || "销售组织单元查询失败，请联系管理员！！");
      }
      bill["salesOrgId_code"] = res.data.code;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });