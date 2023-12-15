let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //组装接口表体
    function packageBody(selectData, bodyData) {
      //查询计量单位编码
      let func1 = extrequire("GT83441AT1.backDefaultGroup.queryUnit");
      let unitRes = func1.execute(bodyData.masterUnit);
      //查询组织编码
      let func2 = extrequire("GT83441AT1.backDefaultGroup.queryOrg");
      let orgRes = func2.execute(bodyData.settlementOrg);
      //查询税目编码
      let func3 = extrequire("GT83441AT1.backDefaultGroup.queryTax");
      let taxRes = func3.execute(bodyData.tax);
      let querySql = "select code from pc.product.Product	where id='" + bodyData.product + "'";
      var queryRes = ObjectStore.queryByYonQL(querySql, "productcenter");
      //含税金额
      let oriSum = MoneyFormatReturnBd(bodyData.oriTaxUnitPrice * bodyData.purcQty, 2);
      //无税金额
      let oriMoney = MoneyFormatReturnBd(bodyData.oriUnitPrice * bodyData.purcQty, 2);
      //税额
      let oriTax = MoneyFormatReturnBd(oriSum - oriMoney, 2);
      let packageBody = {
        product_cCode: queryRes[0].code, //商品编码
        productsku: bodyData.sku, //skuId
        subQty: bodyData.purcQty, //采购数量
        purUOM_Code: unitRes.detail.code, //采购单位编码
        priceUOM_Code: unitRes.detail.code, //计价单位编码
        unit_code: unitRes.detail.code, //主计量单位编码
        qty: bodyData.purcQty, //数量
        taxitems_code: taxRes.detail.code, //税目编码
        receiveOrg_code: orgRes.detail.code, //收货组织编码
        requirementDate: bodyData.requirementDate, //需求日期
        oriTaxUnitPrice: bodyData.oriTaxUnitPrice, //含税单价
        purchaseOrg_code: orgRes.detail.code, //采购组织编码
        priceQty: bodyData.purcQty, //计价数量
        oriUnitPrice: bodyData.oriUnitPrice, //无税单价
        oriMoney: oriMoney, //无税金额
        oriTax: oriTax, //税额
        oriSum: oriSum, //含税金额
        unitExchangeTypePrice: 0, //计价单位转换率的换算方式：0固定换算；1浮动换算    示例：0 ）
        unitExchangeType: 0, //采购单位转换率的换算方式：0固定换算；1浮动换算    示例：0
        invExchRate: 1, //采购换算率
        _status: "Insert",
        memo: bodyData.memo,
        upcode: selectData.code,
        receiver: selectData.receiver, //收货人
        receiveTelePhone: selectData.receiveMobile, //收货电话
        receiveAddress: selectData.receiveAddress, //收货地址
        bodyFreeItem: {
          define1: selectData.code, //来源单据号
          define2: selectData.id, //来源主表主键
          define3: bodyData.id //来源子表主键
        }
      };
      return packageBody;
    }
    //组装接口
    function packageHead(selectData) {
      let resubmitCheckKey = replace(uuid(), "-", "");
      //查询组织编码
      let func1 = extrequire("GT83441AT1.backDefaultGroup.queryOrg");
      let orgRes = func1.execute(selectData.org_id);
      //查询币种简称
      let func2 = extrequire("GT83441AT1.backDefaultGroup.queryCurrency");
      let pricesRes = func2.execute(selectData.orderPrices);
      let packageHead = {
        resubmitCheckKey: resubmitCheckKey, //幂等性
        bustype: "A25001", //交易类型--采购要货
        org_code: orgRes.detail.code, //需求组织编码
        vouchdate: selectData.vouchdate, //单据日期
        currency_code: pricesRes.detail.code, //币种简称
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
    insertData.applyOrders = bodyDetils;
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