let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
        bodyFreeItem: {
          define1: selectData.code, //来源单据号
          define2: selectData.id, //来源主表主键
          define3: bodyData.id, //来源子表主键
          define4: bodyData.futureNum, //未来60天到货
          define5: bodyData.listMoney, //价格表售价
          define6: bodyData.avgMoney, //平均销售价
          define7: bodyData.lastTaxUnitPrice //最新销售价
        }
      };
      return packageBody;
    }
    //组装接口
    function packageHead(selectData) {
      let resubmitCheckKey = replace(uuid(), "-", "");
      let packageHead = {
        resubmitCheckKey: resubmitCheckKey, //幂等性
        salesOrgId: selectData.org_id + "", //销售组织
        transactionTypeId: "yourIdHere", //交易类型--普通销售（无发货）
        vouchdate: selectData.vouchdate, //单据日期
        agentId: selectData.agent + "", //客户
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
        headItem: {
          define1: selectData.receiver, //收货人
          define2: selectData.receiveMobile, //收货电话
          define3: selectData.receiveAddress, //收货地址
          define4: selectData.logisticstype, //物流方式
          define5: selectData.infreighttype, //库房运费结算方
          define6: selectData.outfreighttype, //外采运费结算方
          define7: selectData.issigning //签单返还
        },
        headFreeItem: {
          define1: selectData.code, //上游单据号
          define2: selectData.id //上游主表主键
        },
        _status: "Insert"
      };
      return packageHead;
    }
    let bodyDetils = new Array();
    for (let i = 0; i < param.length; i++) {
      bodyDetils.push(packageBody(context, param[i]));
    }
    var insertData = packageHead(context);
    insertData.orderDetails = bodyDetils;
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
    let getsdUrl = "https://www.example.com/" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    return { result };
  }
}
exports({ entryPoint: MyTrigger });