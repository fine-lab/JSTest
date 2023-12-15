let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //组装接口表体
    function packageBody(selectData, bodyData) {
      let packageBody = {
        stockId: bodyData.instock, //仓库
        "orderDetailPrices!natSum": bodyData.oriSum, //本币含税金额
        "orderDetailPrices!natMoney": bodyData.oriMoney, //本币无税金额
        productId: bodyData.product + "", //商品
        masterUnitId: bodyData.masterUnit + "", //主计量单位
        invExchRate: 1, //销售换算率
        unitExchangeTypePrice: 0, //浮动（销售）
        "orderDetailPrices!oriTax": bodyData.oriTax, //税额
        iProductAuxUnitId: bodyData.masterUnit, //销售单位
        "orderDetailPrices!natUnitPrice": bodyData.oriUnitPrice, //本币无税单价
        invPriceExchRate: 1, //计价换算率
        oriSum: bodyData.oriSum, //含税金额
        "orderDetailPrices!oriMoney": bodyData.oriMoney, //无税金额
        priceQty: bodyData.subQty, //计价数量
        stockOrgId: bodyData.settlementOrg, //库存组织
        iProductUnitId: bodyData.masterUnit, //计价单位
        "orderDetailPrices!natTaxUnitPrice": bodyData.oriTaxUnitPrice, //本币含税单价
        orderProductType: "SALE", //商品售卖类型(销售品)
        subQty: bodyData.subQty, //销售数量
        consignTime: bodyData.consignTime, //计划发货日期
        skuId: bodyData.sku + "", //商品SKUid
        taxId: bodyData.tax + "", //税目税率
        qty: bodyData.subQty, //数量
        settlementOrgId: bodyData.stockOrg + "", //开票组织
        oriTaxUnitPrice: bodyData.oriTaxUnitPrice, //含税成交价
        "orderDetailPrices!natTax": bodyData.oriTax, //本币税额
        unitExchangeType: 0, //浮动（计价
        "orderDetailPrices!oriUnitPrice": bodyData.oriUnitPrice, //无税成交价
        _status: "Insert",
        memo: bodyData.memo,
        orderDetailDefineCharacter: {
          attrext9: selectData.code, //来源单据号
          attrext10: selectData.id, //来源主表主键
          attrext11: bodyData.id, //来源子表主键
          attrext14: bodyData.futureNum, //未来60天到货
          attrext15: bodyData.listMoney, //价格表售价
          attrext16: bodyData.avgMoney, //平均销售价
          attrext18: bodyData.lastTaxUnitPrice, //最新销售价
          attrext35: bodyData.secureStocks, //安全库存
          attrext38: bodyData.bigWareStock //大仓库存
        }
      };
      return packageBody;
    }
    //组装接口
    function packageHead(selectData) {
      let resubmitCheckKey = replace(uuid(), "-", "");
      //查询客户对应的销售区域
      var sqlQuery = "select * from aa.merchant.Merchant where id=" + selectData.agent;
      var merchantRes = ObjectStore.queryByYonQL(sqlQuery, "productcenter");
      //查询客户对应的适用范围
      var sqlMerchantApplyRange = "select * from aa.merchant.MerchantApplyRange4UsePower where merchantId='" + selectData.agent + "'";
      var merchantApplyRangeRes = ObjectStore.queryByYonQL(sqlMerchantApplyRange, "productcenter");
      let packageHead = {
        resubmitCheckKey: resubmitCheckKey, //幂等性
        salesOrgId: selectData.org_id + "", //销售组织
        transactionTypeId: "yourIdHere", //交易类型--普通销售（无发货）
        bizFlow: "6c79c833-ae3a-11ec-9896-6c92bf477043", //流程id
        vouchdate: selectData.vouchdate, //单据日期
        agentId: selectData.agent + "", //客户
        agentRelationId: merchantApplyRangeRes[0].id, //0913,无此字段则销售订单无法变更
        saleAreaId: merchantRes[0].customerArea, //销售区域
        saleDepartmentId: selectData.saleDepartment, //销售部门
        corpContact: selectData.corpContact, //销售业务员
        settlementOrgId: selectData.org_id + "", //开票组织
        "orderPrices!currency": selectData.orderPrices, //币种
        "orderPrices!exchRate": 1, //汇率
        "orderPrices!exchangeRateType": selectData.exchangeRateType, //汇率类型
        "orderPrices!natCurrency": selectData.orderPrices, //本币
        "orderPrices!taxInclusive": true, //单价含税
        receiver: selectData.receiver, //收货人
        receiveZipCode: selectData.receiveZipCode, //收货人邮编
        receiveTelePhone: selectData.receiveTelePhone, //收货人固定电话
        receiveMobile: selectData.receiveMobile, //收货电话
        receiveAddress: selectData.receiveAddress, //收货地址
        invoiceAgentId: selectData.invoiceAgent + "", //开票客户
        modifyInvoiceType: true, //发票类型可改
        invoiceUpcType: selectData.invoiceUpcType, //发票类型
        invoiceTitleType: selectData.invoiceTitleType, //抬头类型
        invoiceTitle: selectData.invoiceTitle, //发票抬头
        taxNum: selectData.taxNum, //纳税识别号
        invoiceTelephone: selectData.invoiceTelephone, //营业电话
        invoiceAddress: selectData.invoiceAddress, //营业地址
        bankName: selectData.bankName, //开户银行
        subBankName: selectData.subBankName, //开户支行
        bankAccount: selectData.bankAccount, //银行账户
        payMoney: selectData.payMoney, //合计含税金额,
        source_id: selectData.id + "", //上游单据主表主键,
        code: "XSYDD-" + selectData.code,
        memo: selectData.remarks, //备注
        creator: selectData.creatorName, //创建人20220808
        creatorId: selectData.creatorId,
        orderDefineCharacter: {
          headDefine1: selectData.receiver, //收货人
          headDefine2: selectData.receiveMobile, //收货电话
          headDefine3: selectData.receiveAddress, //收货地址
          headDefine4: selectData.logisticstype, //物流方式
          headDefine5: selectData.infreighttype, //库房运费结算方
          headDefine6: selectData.outfreighttype, //外采运费结算方
          headDefine7: selectData.issigning, //签单返还
          attrext12: selectData.code, //上游单据号
          attrext13: selectData.id, //上游主表主键
          attrext39: selectData.totalQty, //销售总数量
          attrext40: selectData.totalSecureStocks, //安全总库存
          attrext41: selectData.totalBigWareStock, //大仓总库存
          attrext42: selectData.isapprove //是否审批
        },
        _status: "Insert"
      };
      return packageHead;
    }
    let context = request.billdata;
    let param = request.xsList;
    let bodyDetils = new Array();
    let totalQty = 0;
    let totalSecureStocks = 0;
    let totalBigWareStock = 0;
    let allmoney = 0;
    for (let i = 0; i < param.length; i++) {
      bodyDetils.push(packageBody(context, param[i]));
      let ss1 = param[i].subQty === undefined ? 0 : Number(param[i].subQty);
      let ss2 = param[i].secureStocks === undefined ? 0 : Number(param[i].secureStocks);
      let ss3 = param[i].bigWareStock === undefined ? 0 : Number(param[i].bigWareStock);
      totalQty += ss1;
      totalSecureStocks += ss2;
      totalBigWareStock += ss3;
      allmoney += Number(param[i].oriSum);
    }
    let isapprove = false;
    for (var j = 0; j < param.length; j++) {
      if (param[j].secureStocks != null) {
        let tt = param[j].secureStocks === undefined ? 0 : Number(param[j].secureStocks);
        let ss = param[j].bigWareStock === undefined ? 0 : Number(param[j].bigWareStock);
        if (tt == 0 && ss == 0) {
        } else {
          if (ss <= tt) {
            //大仓库存小于等于安全库存
            isapprove = true;
            break;
          }
        }
      }
    }
    context.totalQty = totalQty;
    context.totalSecureStocks = totalSecureStocks;
    context.totalBigWareStock = totalBigWareStock;
    context.isapprove = "" + isapprove;
    var insertData = packageHead(context);
    insertData.orderDetails = bodyDetils;
    insertData.payMoney = allmoney.toFixed(2);
    let func1 = extrequire("GT83441AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let body = {
      data: insertData
    };
    let wayfunc = extrequire("GT83441AT1.backDefaultGroup.getWayUrl");
    let wayRes = wayfunc.execute(null);
    var gatewayUrl = wayRes.gatewayUrl;
    let getsdUrl = gatewayUrl + "/yonbip/sd/voucherorder/singleSave?access_token=" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });