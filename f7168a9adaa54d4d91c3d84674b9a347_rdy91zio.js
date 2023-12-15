let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let outputLog = "";
    //基础税率
    const baseTariffLevel = 1;
    //流程ID
    const bizFlow = "9801b8f3-6723-11ed-906c-fa163e279f89";
    //流程版本
    const bizFlow_version = "V1.0";
    //汇率类型
    const exchangeRateType = "rdy91zio";
    //页码
    const pageIndex = 1;
    //页大小
    const pageSize = 10;
    //获取汇率类型列表
    const getExchangerateList = "https://www.example.com/";
    //获取商品列表
    const getProductList = "https://www.example.com/";
    //获取单元详情
    const getUnitDetail = "https://www.example.com/";
    //获取销售订单详情
    const getVoucherOrderList = "https://www.example.com/";
    //销售订单单个保存
    const voucherOrderSingleSave = "https://www.example.com/";
    //销售订单审核
    const voucharOrderBatchaudit = "https://www.example.com/";
    const appCode = "AT16A2681C17080003";
    //税率
    var taxRate = 0.06;
    var taxType = "VAT6";
    //汇率
    var exchangeRateValue = 0;
    var HKDexchangeRateValue = "0";
    var USDexchangeRateValue = "0";
    //税率计算公式
    var taxFormula = baseTariffLevel + taxRate;
    var ysSalesOrderId = request.id;
    var ysDefaultStatus = "Insert";
    var salesOrder = {};
    var salesOrder_payMoney = 0;
    var salesOrder_realMoney = 0;
    var salesOrder_orderPrices_taxInclusive = 0;
    var salesOrderDetail = new Array();
    var crmOrderDetails = request.orderDetails;
    //付款状态 NOTPAYMENT为未付款
    var paymentStatus = "";
    //开票金额
    var invoicedAmount = "0";
    //项目编码
    var projectCode = "null";
    //累计出库数量
    var cumulativeIssueQuantity = "0";
    outputLog += `step1 --- ysSalesOrderId --- ${ysSalesOrderId} | `;
    //设置ys销售订单主表信息
    salesOrder.data = {
      id: request.id,
      code: request.orderCode, //编码
      resubmitCheckKey: S4(),
      corpContact: request.corpContact, //销售业务员
      salesOrgId: request.salesOrgId, //销售组织
      transactionTypeId: request.transactionTypeId, //交易类型
      vouchdate: request.vouchdate, //单据日期
      agentId: request.agentId, //客户
      settlementOrgId: request.salesOrgId, //开票组织
      "orderPrices!currency": request.orderPrices_currency, //币种
      "orderPrices!natCurrency": "CNY", //本币
      "orderPrices!exchRate": "0", //汇率
      "orderPrices!exchangeRateType": exchangeRateType, //汇率类型
      bizFlow: bizFlow, //流程ID
      bizFlow_version: bizFlow_version,
      //自定义参数
      orderDefineCharacter: {
        ICE00101: request.orderDefineCharacter_ICE00101, //检测中心
        ICE00102: request.orderDefineCharacter_ICE00102, //检测项目
        ICE00104: request.orderDefineCharacter__ICE00104, //项目性质
        ICE00103: request.orderDefineCharacter_ICE00103, //项目编号
        ICE00105: request.orderDefineCharacter_ICE00105, //靶点名称
        ICE00106: request.orderDefineCharacter_ICE00106, //检是否申报
        ICE00205: request.orderDefineCharacter_ICE00205, //技术负责人
        ICE004: request.ICE004, //区域
        ICE003: request.ICE003, //业务板块
        ICE005: request.ICE005, //检测项目
        ICE006: request.ICE006, //子业务类型
        xmxz: request.xmxz //项目性质
      },
      memo: request.memo,
      orderDetails: salesOrderDetail,
      "orderPrices!taxInclusive": 0, //单价含税
      invoiceAgentId: request.agentId, //开票客户id
      payMoney: "0", //合计含税金额
      RealMoney: "0", //应收金额
      _status: ysDefaultStatus,
      //修改参数
      "orderPrices!orderId": request.id
    };
    //根据输入的币种判断汇率和汇率类型
    if (salesOrder.data["orderPrices!currency"] == "USD" || salesOrder.data["orderPrices!currency"] == "HKD") {
      taxRate = "0";
      taxType = "VAT0";
    }
    //根据输入值判断是否申报
    var isDeclare = salesOrder.data.orderDefineCharacter.ICE00106;
    if (isDeclare == "是") {
      salesOrder.data.orderDefineCharacter.ICE00106 = "true";
    } else if (isDeclare == "否") {
      salesOrder.data.orderDefineCharacter.ICE00106 = "false";
    }
    //获取汇率类型
    let exchangeRateObject = new Object();
    exchangeRateObject.pageSize = pageSize;
    exchangeRateObject.pageIndex = pageIndex;
    exchangeRateObject.externalData = {
      exchangeRateType: exchangeRateType,
      quotationDate: "2023-01-03",
      activeKey: "yourKeyHere"
    };
    //获取到汇率的列表
    let exchangeRateInfo = openLinker("POST", getExchangerateList, appCode, JSON.stringify(exchangeRateObject));
    let exchangeRateList = JSON.parse(exchangeRateInfo);
    let recordList = exchangeRateList.data.recordList;
    for (var i = 0; i < recordList.length; i++) {
      //获取港元汇率
      if (recordList[i].sourceCurrencyId_name == "港元") {
        HKDexchangeRateValue = recordList[i].exchangeRate;
        break;
      }
    }
    for (var k = 0; k < recordList.length; k++) {
      //获取美元汇率
      if (recordList[k].sourceCurrencyId_name == "美元") {
        USDexchangeRateValue = recordList[k].exchangeRate;
        break;
      }
    }
    if (exchangeRateList.code == "200") {
      if (exchangeRateList.data.recordList.length > 0) {
        //判断汇率类型
        if (salesOrder.data["orderPrices!currency"] == salesOrder.data["orderPrices!natCurrency"]) {
          exchangeRateValue = "1";
        } else if (salesOrder.data["orderPrices!currency"] == "USD") {
          exchangeRateValue = USDexchangeRateValue;
        } else if (salesOrder.data["orderPrices!currency"] == "HKD") {
          exchangeRateValue = HKDexchangeRateValue;
        }
      }
    }
    //设置主表汇率
    salesOrder.data["orderPrices!exchRate"] = exchangeRateValue;
    //判断ys销售订单id
    if (ysSalesOrderId == undefined || ysSalesOrderId == null || ysSalesOrderId == "") {
      //不存在，则新增主子表数据
      outputLog += `step2 --- 不存在，则新增主子表数据 | `;
      //遍历crm的子表数据，来设置ys的销售订单子表数据
      for (let i = 0; i < crmOrderDetails.length; i++) {
        let productObject = new Object();
        productObject.pageSize = pageSize;
        productObject.pageIndex = pageIndex;
        productObject.code = crmOrderDetails[i].productId;
        //获取到物料档案的列表
        let productInfo = openLinker("POST", getProductList, appCode, JSON.stringify(productObject));
        let productList = JSON.parse(productInfo);
        let unitId = "";
        var unitCode = "";
        if (productList.code == "200") {
          if (productList.data.recordList.length > 0) {
            //得到当前的主计量单位Id
            unitId = productList.data.recordList[0].unit;
            //计量单位详情查询
            let unitInfo = openLinker("GET", `${getUnitDetail}?id=${unitId}`, appCode, null);
            let unitList = JSON.parse(unitInfo);
            if (unitList.code == "200") {
              //单位编码
              unitCode = unitList.data.code;
            }
          }
        }
        //设置ys子表信息
        let item = {
          productId: crmOrderDetails[i].productId, //商品
          oriSum: crmOrderDetails[i].oriSum, //含税金额
          "orderDetailPrices!natSum": (crmOrderDetails[i].oriSum * exchangeRateValue).toFixed(6), //本币含税金额
          priceQty: crmOrderDetails[i].priceQty,
          "orderDetailPrices!natTaxUnitPrice": ((crmOrderDetails[i].oriSum * exchangeRateValue) / crmOrderDetails[i].qty).toFixed(6), //本币含税单价
          subQty: crmOrderDetails[i].subQty,
          qty: crmOrderDetails[i].qty,
          masterUnitId: unitCode, //主计量单位
          orderProductType: crmOrderDetails[i].orderProductType, //商品售卖类型
          taxId: taxType, //税率
          "orderDetailPrices!natMoney": ((crmOrderDetails[i].oriSum - (crmOrderDetails[i].oriSum / taxFormula) * taxRate) * exchangeRateValue).toFixed(6), //本币无税金额
          "orderDetailPrices!oriTax": ((crmOrderDetails[i].oriSum / taxFormula) * taxRate).toFixed(6), //税额
          iProductAuxUnitId: unitCode, //销售单位
          "orderDetailPrices!natUnitPrice": (((crmOrderDetails[i].oriSum - (crmOrderDetails[i].oriSum / taxFormula) * taxRate) * exchangeRateValue) / crmOrderDetails[i].qty).toFixed(6), //本币无税单价
          "orderDetailPrices!oriMoney": (crmOrderDetails[i].oriSum - (crmOrderDetails[i].oriSum / taxFormula) * taxRate).toFixed(6), //无税金额
          iProductUnitId: unitCode, //计价单位
          skuId: crmOrderDetails[i].productId, //商品SKUid
          oriTaxUnitPrice: (crmOrderDetails[i].oriSum / crmOrderDetails[i].qty).toFixed(6), //含税成交价
          "orderDetailPrices!natTax": ((crmOrderDetails[i].oriSum / taxFormula) * taxRate * exchangeRateValue).toFixed(6), //本币税额
          "orderDetailPrices!oriUnitPrice": ((crmOrderDetails[i].oriSum - (crmOrderDetails[i].oriSum / taxFormula) * taxRate) / crmOrderDetails[i].qty).toFixed(6), //无税成交价
          unitExchangeTypePrice: 0, //浮动（销售）
          unitExchangeType: 0, //浮动（计价）
          stockOrgId: request.salesOrgId, //库存组织id
          settlementOrgId: request.salesOrgId, //开票组织id
          consignTime: request.vouchdate, //计划发货日期
          invExchRate: "1", //销售换算率
          invPriceExchRate: "1", //计价换算率
          _status: "Insert", //操作标识符
          memo: crmOrderDetails[i].crmid
        };
        //把子表数据加入到了销售订单里面
        salesOrder.data.orderDetails.push(item);
        salesOrder_payMoney += parseFloat(item.oriSum); //合计含税金额
        salesOrder_realMoney = salesOrder_payMoney; //应收金额
      }
      //设置主表合计含税总金额及应收金额
      salesOrder.data.payMoney = salesOrder_payMoney;
      salesOrder.data.RealMoney = salesOrder_realMoney;
    } else {
      //将主表的操作标识更改为更新
      salesOrder.data._status = "Update";
      //存在，则新增，修改，删除子表数据
      outputLog += `step4 --- 存在，则新增，修改，删除子表数据 | `;
      //根据ys销售订单id获取销售订单详情
      let salesOrderInfo = openLinker("GET", `${getVoucherOrderList}?id=${request.id}`, appCode, null);
      let salesOrderlist = JSON.parse(salesOrderInfo);
      salesOrder.data.orderDefineCharacter.icexiangmu002 = salesOrderlist.data.orderDefineCharacter.icexiangmu002;
      salesOrder.data.orderDefineCharacter.icexiangmu001 = salesOrderlist.data.orderDefineCharacter.icexiangmu001;
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
          var deliveredQuantity = {
            "cumulativeIssueQuantity ": salesOrderlist.data.orderDetails[i].totalOutStockQuantity
          };
        }
      }
      // 	调用销售订单弃审接口
      let salesOrderId = request.id;
      let salesOrderAbandonmentRequest = {
        data: [
          {
            id: salesOrderId
          }
        ]
      };
      var salesOrderAbandonmentResponse = openLinker("POST", "https://www.example.com/", appCode, JSON.stringify(salesOrderAbandonmentRequest));
      var Abandonment = JSON.parse(salesOrderAbandonmentResponse);
      var massage = Abandonment.data.failInfos[0];
      if (massage != null) {
        return { Abandonment };
      }
      //获取传入的crm数据id字段信息调用销售订单详情查询接口
      //获取ys销售订单子表数据对子表进行（增加、删除、修改）操作
      var ysSalesOrderDetails = salesOrderlist.data.orderDetails;
      //提前准备好了crmOrderDetails
      for (let y = 0; y < ysSalesOrderDetails.length; y++) {
        var ysSalesOrderDetails_memo = ysSalesOrderDetails[y].memo;
        for (let j = 0; j < crmOrderDetails.length; j++) {
          var crm_id = crmOrderDetails[j].crmid;
          if (ysSalesOrderDetails_memo == crm_id) {
            //修改ysItem的值
            ysSalesOrderDetails[y]["orderDetailPrices!oriMoney"] = (crmOrderDetails[j].oriSum - (crmOrderDetails[j].oriSum / taxFormula) * taxRate).toFixed(6); //无税金额
            ysSalesOrderDetails[y]["orderDetailPrices!natMoney"] = ((crmOrderDetails[j].oriSum - (crmOrderDetails[j].oriSum / taxFormula) * taxRate) * exchangeRateValue).toFixed(6); //本币无税金额
            ysSalesOrderDetails[y]["orderDetailPrices!natTax"] = ((crmOrderDetails[j].oriSum / taxFormula) * taxRate * exchangeRateValue).toFixed(6); //本币税额
            ysSalesOrderDetails[y]["orderDetailPrices!natTaxUnitPrice"] = ((crmOrderDetails[j].oriSum * exchangeRateValue) / crmOrderDetails[j].qty).toFixed(6); //本币含税单价
            ysSalesOrderDetails[y].oriSum = crmOrderDetails[j].oriSum; //含税金额
            ysSalesOrderDetails[y].priceQty = crmOrderDetails[j].priceQty; //计价数量
            ysSalesOrderDetails[y].subQty = crmOrderDetails[j].subQty; //销售数量
            ysSalesOrderDetails[y].qty = crmOrderDetails[j].qty;
            ysSalesOrderDetails[y].taxType = crmOrderDetails[j].taxType; //税率
            ysSalesOrderDetails[y].productId = crmOrderDetails[j].productId; //商品
            ysSalesOrderDetails[y].oriTaxUnitPrice = (crmOrderDetails[j].oriSum / crmOrderDetails[j].qty).toFixed(6); //含税成交价
            ysSalesOrderDetails[y].memo = crmOrderDetails[j].crmid; //备注
            ysSalesOrderDetails[y].orderProductType = crmOrderDetails[j].orderProductType; //商品售卖类型
            ysSalesOrderDetails[y]["orderDetailPrices!oriTax"] = ((crmOrderDetails[j].oriSum / taxFormula) * taxRate).toFixed(6); //税额
            ysSalesOrderDetails[y]["orderDetailPrices!natSum"] = (crmOrderDetails[j].oriSum * exchangeRateValue).toFixed(6); //本币含税金额
            ysSalesOrderDetails[y]["orderDetailPrices!oriUnitPrice"] = ((crmOrderDetails[j].oriSum - (crmOrderDetails[j].oriSum / taxFormula) * taxRate) / crmOrderDetails[j].qty).toFixed(6); //无税成交价
            ysSalesOrderDetails[y]["orderDetailPrices!natUnitPrice"] = (
              ((crmOrderDetails[j].oriSum - (crmOrderDetails[j].oriSum / taxFormula) * taxRate) * exchangeRateValue) /
              crmOrderDetails[j].qty
            ).toFixed(6); //本币无税单价
            ysSalesOrderDetails[y]._status = "Update";
            break;
          } else {
            //如果j到达最后的值（crm无、ys有删除）
            if (j == crmOrderDetails.length - 1) {
              //删除，修改数据为0
              ysSalesOrderDetails[y]["oriTaxUnitPrice"] = 0;
              ysSalesOrderDetails[y].invPriceExchRate = 0;
              ysSalesOrderDetails[y].invExchRate = 0;
              ysSalesOrderDetails[y]["orderDetailPrices!natSum"] = 0;
              ysSalesOrderDetails[y].oriSum = "0";
              ysSalesOrderDetails[y].qty = 0;
              ysSalesOrderDetails[y].subQty = 0;
              ysSalesOrderDetails[y].priceQty = 0;
              ysSalesOrderDetails[y]._status = "Update";
            }
          }
        }
        //本币无税金额
        if (ysSalesOrderDetails[y]["orderDetailPrices!natMoney"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!natMoney"] = 0;
        }
        //税额
        if (ysSalesOrderDetails[y]["orderDetailPrices!oriTax"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!oriTax"] = 0;
        }
        //本币无税单价
        if (ysSalesOrderDetails[y]["orderDetailPrices!natUnitPrice"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!natUnitPrice"] = 0;
        }
        //无税金额
        if (ysSalesOrderDetails[y]["orderDetailPrices!oriMoney"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!oriMoney"] = 0;
        }
        //本币含税单价
        if (ysSalesOrderDetails[y]["orderDetailPrices!natTaxUnitPrice"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!natTaxUnitPrice"] = 0;
        }
        //本币税额
        if (ysSalesOrderDetails[y]["orderDetailPrices!natTax"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!natTax"] = 0;
        }
        //无税成交价
        if (ysSalesOrderDetails[y]["orderDetailPrices!oriUnitPrice"] == undefined) {
          ysSalesOrderDetails[y]["orderDetailPrices!oriUnitPrice"] = 0;
        }
        //设置销售订单子表数据
        salesOrder.data.orderDetails.push(ysSalesOrderDetails[y]);
        salesOrder_payMoney += parseFloat(ysSalesOrderDetails[y].oriSum); //合计含税金额
      }
      salesOrder_realMoney = salesOrder_payMoney; //应收金额
      for (let x = 0; x < crmOrderDetails.length; x++) {
        let crm_temp_id = crmOrderDetails[x].crmid;
        for (let y = 0; y < ysSalesOrderDetails.length; y++) {
          let ys_temp_id = ysSalesOrderDetails[y].memo;
          if (ys_temp_id == crm_temp_id) {
            break;
          } else {
            if (y == ysSalesOrderDetails.length - 1) {
              let productObject = new Object();
              productObject.pageSize = pageSize;
              productObject.pageIndex = pageIndex;
              productObject.code = crmOrderDetails[x].productId;
              //获取到物料档案的列表
              let productInfo = openLinker("POST", getProductList, appCode, JSON.stringify(productObject));
              let productList = JSON.parse(productInfo);
              let unitId = "";
              var unitCode = "";
              if (productList.code == "200") {
                if (productList.data.recordList.length > 0) {
                  //得到当前的主计量单位Id
                  unitId = productList.data.recordList[0].unit;
                  //计量单位详情查询
                  let unitInfo = openLinker("GET", `${getUnitDetail}?id=${unitId}`, appCode, null);
                  let unitList = JSON.parse(unitInfo);
                  if (unitList.code == "200") {
                    //单位编码
                    unitCode = unitList.data.code;
                  }
                }
              }
              //设置ys子表信息
              let item = {
                productId: crmOrderDetails[x].productId, //商品
                oriSum: crmOrderDetails[x].oriSum, //含税金额
                "orderDetailPrices!natSum": (crmOrderDetails[x].oriSum * exchangeRateValue).toFixed(6), //本币含税金额
                priceQty: crmOrderDetails[x].priceQty,
                "orderDetailPrices!natTaxUnitPrice": ((crmOrderDetails[x].oriSum * exchangeRateValue) / crmOrderDetails[x].qty).toFixed(6), //本币含税单价
                subQty: crmOrderDetails[x].subQty,
                qty: crmOrderDetails[x].qty,
                masterUnitId: unitCode, //主计量单位
                orderProductType: crmOrderDetails[x].orderProductType, //商品售卖类型
                taxId: taxType, //税率：取固定值
                "orderDetailPrices!natMoney": ((crmOrderDetails[x].oriSum - (crmOrderDetails[x].oriSum / taxFormula) * taxRate) * exchangeRateValue).toFixed(6), //本币无税金额
                "orderDetailPrices!oriTax": ((crmOrderDetails[x].oriSum / taxFormula) * taxRate).toFixed(6), //税额
                iProductAuxUnitId: unitCode, //销售单位
                "orderDetailPrices!natUnitPrice": (((crmOrderDetails[x].oriSum - (crmOrderDetails[x].oriSum / taxFormula) * taxRate) * exchangeRateValue) / crmOrderDetails[x].qty).toFixed(6), //本币无税单价
                "orderDetailPrices!oriMoney": (crmOrderDetails[x].oriSum - (crmOrderDetails[x].oriSum / taxFormula) * taxRate).toFixed(6), //无税金额
                iProductUnitId: unitCode, //计价单位
                skuId: crmOrderDetails[x].productId, //商品SKUid
                oriTaxUnitPrice: (crmOrderDetails[x].oriSum / crmOrderDetails[x].qty).toFixed(6), //含税成交价
                "orderDetailPrices!natTax": ((crmOrderDetails[x].oriSum / taxFormula) * taxRate * exchangeRateValue).toFixed(6), //本币税额
                "orderDetailPrices!oriUnitPrice": ((crmOrderDetails[x].oriSum - (crmOrderDetails[x].oriSum / taxFormula) * taxRate) / crmOrderDetails[x].qty).toFixed(6), //无税成交价
                unitExchangeTypePrice: 0, //浮动（销售）
                unitExchangeType: 0, //浮动（计价）
                stockOrgId: request.salesOrgId, //库存组织id
                settlementOrgId: request.salesOrgId, //开票组织id
                consignTime: request.vouchdate, //计划发货日期
                invExchRate: "1", //销售换算率
                invPriceExchRate: "1", //计价换算率
                _status: "Insert", //操作标识符
                memo: crmOrderDetails[x].crmid
              };
              item._status = "Insert";
              salesOrder.data.orderDetails.push(item);
              salesOrder_payMoney += parseFloat(item.oriSum); //合计含税金额
              salesOrder_realMoney = salesOrder_payMoney; //应收金额
            }
          }
        }
      }
      //设置主表合计含税总金额及应收金额
      salesOrder.data.payMoney = salesOrder_payMoney;
      salesOrder.data.RealMoney = salesOrder_realMoney;
    }
    //调用销售订单保存接口
    let strResponseClient = openLinker("POST", voucherOrderSingleSave, appCode, JSON.stringify(salesOrder));
    var singleSaveJson = JSON.parse(strResponseClient);
    if (singleSaveJson.code == "200") {
      // 获取销售订单id
      let salesOrderId = singleSaveJson.data.id;
      let data = {};
      let voucharOrderBatchauditRequest = {
        data: [
          {
            id: salesOrderId
          }
        ]
      };
      //调用销售订单审核接口
      var voucharOrderBatchauditResponse = openLinker("POST", voucharOrderBatchaudit, appCode, JSON.stringify(voucharOrderBatchauditRequest));
    }
    //返回销售订单保存后的数据（参数格式不可修改）
    return { strResponseClient };
  }
}
exports({ entryPoint: MyAPIHandler });