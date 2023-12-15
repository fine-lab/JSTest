let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //组装接口表体
    function packageBody(bodyData) {
      let packageBody = {
        "orderDetailPrices!natSum": bodyData.qujiabiaohanshuijine, //本币含税金额
        "orderDetailPrices!natMoney": bodyData.qujiabiaowushuijine, //本币无税金额
        productId: bodyData.productId + "", //商品
        masterUnitId: bodyData.masterUnit + "", //主计量单位
        invExchRate: 1, //销售换算率
        unitExchangeTypePrice: 0, //浮动（销售）
        "orderDetailPrices!oriTax": bodyData.qujiabiaoshuie, //税额
        iProductAuxUnitId: bodyData.masterUnit, //销售单位
        "orderDetailPrices!natUnitPrice": bodyData.qujiabiaowushuijine, //本币无税单价
        invPriceExchRate: 1, //计价换算率
        oriSum: bodyData.qujiabiaohanshuijine, //含税金额
        "orderDetailPrices!oriMoney": bodyData.qujiabiaowushuijine, //无税金额
        priceQty: 1, //计价数量
        stockOrgId: bodyData.vorgId, //库存组织
        iProductUnitId: bodyData.masterUnit, //计价单位
        "orderDetailPrices!natTaxUnitPrice": bodyData.qujiabiaohanshuijine, //本币含税单价
        orderProductType: "SALE", //商品售卖类型(销售品)
        subQty: 1, //销售数量
        consignTime: bodyData.shouyangriqi, //计划发货日期
        skuId: bodyData.skuid + "", //商品SKUid
        taxId: bodyData.taxRate + "", //税目税率
        qty: 1, //数量
        settlementOrgId: bodyData.vorgId + "", //开票组织
        oriTaxUnitPrice: bodyData.qujiabiaohanshuijine, //含税成交价
        "orderDetailPrices!natTax": bodyData.qujiabiaoshuie, //本币税额
        unitExchangeType: 0, //浮动（计价
        "orderDetailPrices!oriUnitPrice": bodyData.qujiabiaowushuijine, //无税成交价
        _status: "Insert",
        projectId: bodyData.insItems, //项目
        memo: bodyData.memo //备注
      };
      let bodyDetils = new Array();
      bodyDetils.push(packageBody);
      return bodyDetils;
    }
    //组装接口
    function packageHead(bodyData) {
      let resubmitCheckKey = replace(uuid(), "-", "");
      //查询客户对应的适用范围
      var sqlMerchantApplyRange = "select * from aa.merchant.MerchantApplyRange4UsePower where merchantId='" + bodyData.merchant + "'";
      var merchantApplyRangeRes = ObjectStore.queryByYonQL(sqlMerchantApplyRange, "productcenter");
      let packageHead = {
        resubmitCheckKey: resubmitCheckKey, //幂等性
        salesOrgId: bodyData.vorgId + "", //销售组织
        transactionTypeId: "yourIdHere", //交易类型--服务销售
        vouchdate: bodyData.shouyangriqi, //单据日期
        agentId: bodyData.merchant + "", //客户
        agentRelationId: merchantApplyRangeRes[0].id, //0913,无此字段则销售订单无法变更
        corpContact: bodyData.staffNew, //销售业务员
        saleDepartmentId: bodyData.adminDept, //销售部门
        settlementOrgId: bodyData.vorgId + "", //开票组织
        "orderPrices!currency": "CNY", //币种
        "orderPrices!exchRate": 1, //汇率
        "orderPrices!exchangeRateType": "01", //汇率类型
        "orderPrices!natCurrency": "CNY", //本币
        "orderPrices!taxInclusive": true, //单价含税
        invoiceAgentId: bodyData.merchant + "", //开票客户
        payMoney: bodyData.qujiabiaohanshuijine, //合计含税金额
        creator: bodyData.creator, //创建人20220808
        mainprojectId: bodyData.insItems, //项目
        bizFlow: "188b7768-9542-11ed-9896-6c92bf477043", //业务流
        headItem: {
          define1: bodyData.shouyangdanleixing
        },
        headFreeItem: {
          define1: bodyData.code + "", //来源收样单号
          define2: bodyData.id, //来源收样单id
          define3: bodyData.chanpinxian //产品线
        },
        memo: bodyData.remarks, //备注
        _status: "Insert"
      };
      return packageHead;
    }
    var bodyData = request; //样本信息
    //查询物料主键、主计量单位、sku
    var queryProduct = "select * from pc.product.Product where code='JCFY000001'";
    var productRes = ObjectStore.queryByYonQL(queryProduct, "productcenter");
    if (productRes.length == 0) {
      throw new Error("未查询到物料编码【JCFY000001】对应的物料档案信息！");
    } else {
      bodyData.productId = productRes[0].id; //物料主键
      bodyData.skuid = productRes[0].defaultSKUId; //物料默认SKU
      bodyData.masterUnit = productRes[0].unit; //物料主计量单位
    }
    var insertData = packageHead(bodyData);
    insertData.orderDetails = packageBody(bodyData);
    let urlFunc = extrequire("AT15F164F008080007.utils.getWayUrl");
    let urlRes = urlFunc.execute(null);
    var wayUrl = urlRes.gatewayUrl;
    let tokenFunc = extrequire("AT15F164F008080007.utils.getToken");
    let tokenRes = tokenFunc.execute(null);
    var token = tokenRes.access_token;
    var header = { "Content-Type": "application/json" };
    var sendUrl = wayUrl + "/yonbip/sd/voucherorder/singleSave?access_token=" + token;
    let body = { data: insertData };
    var strResponse = postman("POST", sendUrl, JSON.stringify(header), JSON.stringify(body));
    var responseObj = JSON.parse(strResponse);
    var responseOCode = responseObj.code;
    if (responseOCode != "200") {
      throw new Error("调用销售订单单个保存接口出错，" + responseObj.message);
    }
    return { responseOCode };
  }
}
exports({ entryPoint: MyAPIHandler });