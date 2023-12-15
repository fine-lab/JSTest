let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = {};
    var res = S4();
    var resubmitCheckKey = res;
    var payMoney = "0"; //合计含税金额
    var realMoney = "0"; //应收金额
    var invoiceAgentId = request.agentId; //开票客户id
    var orderPrices_taxInclusive = 0; //单价含税
    var corpContact = request.corpContact; //销售业务员
    var salesOrgId = request.salesOrgId; //销售组织
    var transactionTypeId = request.transactionTypeId; //交易类型
    var vouchdate = request.vouchdate; //单据日期
    var agentId = request.agentId; //客户
    var settlementOrgId = request.salesOrgId; //开票组织
    var orderPrices_currency = request.orderPrices_currency; //币种
    var orderPrices_natCurrency = "CNY"; //本币
    var orderPrices_exchRate = request.orderPrices_exchRate; //汇率
    var orderDefineCharacter_ICE00101 = request.orderDefineCharacter_ICE00101; //检测中心
    var orderDefineCharacter_ICE00102 = request.orderDefineCharacter_ICE00102; //检测项目
    var orderDefineCharacter_ICE00105 = request.orderDefineCharacter_ICE00105; //靶点名称
    var orderDefineCharacter_ICE00106 = request.orderDefineCharacter_ICE00106; //检是否申报
    if (orderDefineCharacter_ICE00106 == "是") {
      orderDefineCharacter_ICE00106 = "true";
    } else if (orderDefineCharacter_ICE00106 == "否") {
      orderDefineCharacter_ICE00106 = "false";
    }
    var orderDefineCharacter_ICE00103 = request.orderDefineCharacter_ICE00103; //项目编号
    var orderDefineCharacter__ICE00104 = request.orderDefineCharacter__ICE00104; //项目性质
    var orderDefineCharacter_ICE00205 = request.orderDefineCharacter_ICE00205; //技术负责人
    var memo = request.memo;
    var orderPrices_exchRate = 0;
    var orderCode = request.orderCode; //编码
    var bizFlow = "9801b8f3-6723-11ed-906c-fa163e279f89"; //流程ID
    var bizFlow_version = "V1.0";
    var id = request.id;
    var _status;
    if (id == "" || id == null || id == undefined) {
      _status = "Insert";
    } else {
      _status = "Update";
    }
    //获取汇率类型
    let exchangeRateType = "rdy91zio";
    let exchangeRateObject = new Object();
    exchangeRateObject.pageSize = 10;
    exchangeRateObject.pageIndex = 1;
    exchangeRateObject.externalData = {
      exchangeRateType: "rdy91zio",
      quotationDate: "2023-01-03",
      activeKey: "yourKeyHere"
    };
    //获取到汇率的列表
    let exchangeRateInfo = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(exchangeRateObject));
    let exchangeRateValue = 0;
    let exchangeRateList = JSON.parse(exchangeRateInfo);
    let HKDexchangeRateValue = "0";
    let USDexchangeRateValue = "0";
    let recordList = exchangeRateList.data.recordList;
    for (var j = 0; j < recordList.length; j++) {
      if (recordList[j].sourceCurrencyId_name == "港元") {
        HKDexchangeRateValue = recordList[j].exchangeRate;
        break;
      }
    }
    for (var k = 0; k < recordList.length; k++) {
      if (recordList[k].sourceCurrencyId_name == "美元") {
        USDexchangeRateValue = recordList[k].exchangeRate;
        break;
      }
    }
    let aa = exchangeRateList.code;
    if (exchangeRateList.code == "200") {
      if (exchangeRateList.data.recordList.length > 0) {
        //得到当前的汇率
        if (orderPrices_currency == orderPrices_natCurrency) {
          exchangeRateValue = "1";
        } else if (orderPrices_currency == "USD") {
          exchangeRateValue = USDexchangeRateValue;
        } else if (orderPrices_currency == "HKD") {
          exchangeRateValue = HKDexchangeRateValue;
        }
      }
    }
    var stockOrgId = request.salesOrgId;
    var settlementOrgId = request.salesOrgId;
    var consignTime = request.vouchdate;
    var invExchRate = "1";
    var invPriceExchRate = "1";
    var orderDetailsRequest = request.orderDetails;
    var orderDetails = new Array();
    //测试总金额
    for (let i = 0; i < orderDetailsRequest.length; i++) {
      let productObject = new Object();
      productObject.pageSize = 10;
      productObject.pageIndex = 1;
      productObject.code = orderDetailsRequest[i].productId;
      //获取到物料档案的列表
      let productInfo = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(productObject));
      let productList = JSON.parse(productInfo);
      let unitId = "";
      let unitCode = "";
      let materialFileId = "";
      if (productList.code == "200") {
        if (productList.data.recordList.length > 0) {
          //得到当前的主计量单位Id
          unitId = productList.data.recordList[0].unit;
          //获取到物料档案的列表
          //计量单位详情查询
          let unitInfo = openLinker("GET", "https://www.example.com/" + unitId, "AT16A2681C17080003", null);
          let unitList = JSON.parse(unitInfo);
          if (unitList.code == "200") {
            unitCode = unitList.data.code;
          }
        }
      }
      if (id) {
        //获取用户输入的crmid值
        //销售订单详情查询
        var idProduct;
        var id = "0";
        id = request.id;
        var SalesOrderDetailsInquiry = openLinker("GET", "https://www.example.com/" + id, "AT16A2681C17080003", null);
        var DetailsInquiry = JSON.parse(SalesOrderDetailsInquiry);
        var SalesOrderDetails = DetailsInquiry.data.orderDetails;
        for (let x = 0; x < SalesOrderDetails.length; x++) {
          if (SalesOrderDetails[x].memo == orderDetailsRequest[i].crmid) {
            idProduct = SalesOrderDetails[x].id;
          }
        }
      }
      //根据id修改订单状态
      var __status;
      if (idProduct == "" || idProduct == null || idProduct == undefined) {
        __status = "Insert";
      } else {
        __status = "Update";
      }
      var item = {
        productId: orderDetailsRequest[i].productId, //商品
        oriSum: orderDetailsRequest[i].oriSum, //含税金额
        "orderDetailPrices!natSum": (orderDetailsRequest[i].oriSum * exchangeRateValue).toFixed(6), //本币含税金额
        priceQty: orderDetailsRequest[i].priceQty,
        "orderDetailPrices!natTaxUnitPrice": ((orderDetailsRequest[i].oriSum * exchangeRateValue) / orderDetailsRequest[i].qty).toFixed(6), //本币含税单价
        subQty: orderDetailsRequest[i].subQty,
        qty: orderDetailsRequest[i].qty,
        masterUnitId: unitCode, //主计量单位
        orderProductType: orderDetailsRequest[i].orderProductType, //商品售卖类型
        taxId: "VAT6", //税率：取固定值
        "orderDetailPrices!natMoney": ((orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.06)) * 0.06) * exchangeRateValue).toFixed(6), //本币无税金额
        "orderDetailPrices!oriTax": ((orderDetailsRequest[i].oriSum / (1 + 0.06)) * 0.06).toFixed(6), //税额
        iProductAuxUnitId: unitCode, //销售单位
        "orderDetailPrices!natUnitPrice": (((orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.06)) * 0.06) * exchangeRateValue) / orderDetailsRequest[i].qty).toFixed(6), //本币无税单价
        "orderDetailPrices!oriMoney": (orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.06)) * 0.06).toFixed(6), //无税金额
        iProductUnitId: unitCode, //计价单位
        skuId: orderDetailsRequest[i].productId, //商品SKUid
        oriTaxUnitPrice: (orderDetailsRequest[i].oriSum / orderDetailsRequest[i].qty).toFixed(6), //含税成交价
        "orderDetailPrices!natTax": ((orderDetailsRequest[i].oriSum / (1 + 0.06)) * 0.06 * exchangeRateValue).toFixed(6), //本币税额
        "orderDetailPrices!oriUnitPrice": ((orderDetailsRequest[i].oriSum - (orderDetailsRequest[i].oriSum / (1 + 0.06)) * 0.06) / orderDetailsRequest[i].qty).toFixed(6), //无税成交价
        unitExchangeTypePrice: 0, //浮动（销售）
        unitExchangeType: 0, //浮动（计价）
        stockOrgId: stockOrgId, //库存组织id
        settlementOrgId: settlementOrgId, //开票组织id
        consignTime: consignTime, //计划发货日期
        invExchRate: invExchRate, //销售换算率
        invPriceExchRate: invPriceExchRate, //计价换算率
        //修改
        _status: __status, //操作标识符
        id: idProduct, //销售订单子表id
        "orderDetailPrices!orderDetailId": idProduct, //订单详情id
        memo: orderDetailsRequest[i].crmid
      };
      orderDetails.push(item);
      payMoney = orderDetailsRequest[i].oriSum; //合计含税金额
      realMoney = orderDetailsRequest[i].oriSum; //应收金额
    }
    var payMoney_v2 = payMoney; //合计含税金额
    var realMoney_v2 = realMoney; //应收金额
    let body = {
      data: {
        id: id,
        code: orderCode,
        resubmitCheckKey: resubmitCheckKey,
        corpContact: corpContact,
        salesOrgId: salesOrgId,
        transactionTypeId: transactionTypeId,
        vouchdate: vouchdate,
        agentId: agentId,
        settlementOrgId: settlementOrgId,
        "orderPrices!currency": orderPrices_currency,
        "orderPrices!natCurrency": orderPrices_natCurrency,
        "orderPrices!exchRate": exchangeRateValue,
        "orderPrices!exchangeRateType": "rdy91zio",
        bizFlow: bizFlow,
        bizFlow_version: bizFlow_version,
        //自定义参数
        orderDefineCharacter: {
          ICE00101: orderDefineCharacter_ICE00101,
          ICE00102: orderDefineCharacter_ICE00102,
          ICE00104: orderDefineCharacter__ICE00104,
          ICE00103: orderDefineCharacter_ICE00103,
          ICE00105: orderDefineCharacter_ICE00105,
          ICE00106: orderDefineCharacter_ICE00106,
          ICE00205: orderDefineCharacter_ICE00205
        },
        memo: memo,
        orderDetails: orderDetails,
        "orderPrices!taxInclusive": orderPrices_taxInclusive,
        invoiceAgentId: invoiceAgentId,
        payMoney: payMoney_v2,
        realMoney: realMoney_v2,
        realMoney: realMoney,
        _status: _status,
        //修改参数
        "orderPrices!orderId": id
      }
    };
    //判断id是否存在（存在：订单变更，不存在：订单新增）
    if (id == "" || id == null || id == undefined) {
      //调用销售订单保存接口
      let strResponseClient = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
      var SalesOrderSave = JSON.parse(strResponseClient);
      if (SalesOrderSave.code == "200") {
        // 获取销售订单id
        var SalesOrderId = SalesOrderSave.data.id;
        let data = {};
        let body = {
          data: [
            {
              id: SalesOrderId
            }
          ]
        };
        //调用销售订单审核接口
        var SalesOrderSubmission = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
        var Submission = JSON.parse(SalesOrderSubmission);
      }
      return { strResponseClient };
    } else {
      let salesOrderId = request.id;
      let salesOrderInfo = openLinker("GET", "https://www.example.com/" + salesOrderId, "AT16A2681C17080003", null);
      let salesOrderlist = JSON.parse(salesOrderInfo);
      let paymentStatus; //付款状态 NOTPAYMENT为未付款
      let projectCode = "null"; //项目编码
      let invoicedAmount = "0"; //开票金额
      let cumulativeIssueQuantity = "0"; //累计出库数量
      //获取付款状态、项目编码、开票金额、累计出库数量
      if (salesOrderlist.code == "200") {
        //获取付款状态
        if (salesOrderlist.data.payStatusCode) {
          paymentStatus = salesOrderlist.data.payStatusCode;
        }
        //获取项目编码
        if (salesOrderlist.data.orderDetails.projectId_code >= 0) {
          projectCode = salesOrderlist.data.orderDetails.projectId_code;
        }
        //获得开票金额
        if (salesOrderlist.data.orderPrices.invoiceOriSum >= 0) {
          invoicedAmount = salesOrderlist.data.orderPrices.invoiceOriSum;
        }
        //获取累计出库数量
        var QuantityDelivered = new Array();
        for (let i = 0; i < salesOrderlist.data.orderDetails.length; i++) {
          var item = {
            "cumulativeIssueQuantity ": salesOrderlist.data.orderDetails[i].totalOutStockQuantity
          };
        }
      }
      if (paymentStatus != "NOTPAYMENT") {
        paymentStatus = "1"; //其他支付状态
      } else {
        paymentStatus = "0";
      }
      if (projectCode > 0) {
        projectCode = "1"; //存在项目编码
      }
      if (invoicedAmount > 0) {
        invoicedAmount = 1; //存在开票金额
      }
      if (cumulativeIssueQuantity > 0) {
        cumulativeIssueQuantity = 1; //存在出库数量
      }
      if (paymentStatus > 0 || (projectCode > 0 && projectCode != undefined && projectCode != null) || invoicedAmount > 0 || cumulativeIssueQuantity > 0) {
        //当前订单有上下游单据，返回错误信息
        return { message: "已有上下游单据,不可弃审" };
      } else {
        let data = {};
        let body = {
          data: [
            {
              id: salesOrderId
            }
          ]
        };
        var OrderAbandonment = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
        var Abandonment = JSON.parse(OrderAbandonment);
      }
    }
    //销售订单单个保存
    let strResponseClient = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
    var SalesOrderSave = JSON.parse(strResponseClient);
    if (SalesOrderSave.code == "200") {
      // 获取销售订单id
      var SalesOrderId = SalesOrderSave.data.id;
      let data = {};
      let body = {
        data: [
          {
            id: SalesOrderId
          }
        ]
      };
      //调用销售订单审核接口
      var SalesOrderSubmission = openLinker("POST", "https://www.example.com/", "AT16A2681C17080003", JSON.stringify(body));
    }
    return { strResponseClient };
  }
}
exports({ entryPoint: MyAPIHandler });