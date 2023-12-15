let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //组装接口表体
    function packageBody(selectData, bodyData) {
      //查询计量单位编码
      let queryUnitSql = "select code from pc.unit.Unit	where id='" + bodyData.masterUnit + "'";
      var unitRes = ObjectStore.queryByYonQL(queryUnitSql, "productcenter");
      //查询组织编码
      let queryOrgSql = "select * from org.func.BaseOrg where id='" + bodyData.settlementOrg + "'";
      var orgRes = ObjectStore.queryByYonQL(queryOrgSql, "orgcenter");
      //查询税目编码
      let queryTaxSql = "select code from bd.taxrate.TaxRateVO	where id='" + bodyData.tax + "'";
      var taxRes = ObjectStore.queryByYonQL(queryTaxSql, "ucfbasedoc");
      //查询物料编码
      let querySql = "select code from pc.product.Product	where id='" + bodyData.product + "'";
      var queryRes = ObjectStore.queryByYonQL(querySql, "productcenter");
      //含税金额
      let oriSum = MoneyFormatReturnBd(bodyData.oriTaxUnitPrice * bodyData.purcQty, 2);
      //无税金额
      let oriMoney = MoneyFormatReturnBd(bodyData.oriUnitPrice * bodyData.purcQty, 2);
      //税额
      let oriTax = MoneyFormatReturnBd(oriSum - oriMoney, 2);
      let packageBody = {
        currency: selectData.orderPrices, //币种--20231031增加
        product_cCode: queryRes[0].code, //商品编码
        productsku: bodyData.sku, //skuId
        subQty: bodyData.purcQty, //采购数量
        purUOM_Code: unitRes[0].code, //采购单位编码
        priceUOM_Code: unitRes[0].code, //计价单位编码
        unit_code: unitRes[0].code, //主计量单位编码
        qty: bodyData.purcQty, //数量
        receiveOrg_code: orgRes[0].code, //收货组织编码
        requirementDate: bodyData.requirementDate, //需求日期
        purchaseOrg_code: orgRes[0].code, //采购组织编码
        priceQty: bodyData.purcQty, //计价数量
        unitExchangeTypePrice: 0, //计价单位转换率的换算方式：0固定换算；1浮动换算    示例：0 ）
        unitExchangeType: 0, //采购单位转换率的换算方式：0固定换算；1浮动换算    示例：0
        invExchRate: 1, //采购换算率
        invPriceExchRate: 1, //计价换算率
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
      //查询仓库编码
      let queryWareHouseSql = "select code from aa.warehouse.Warehouse	where id='" + selectData.instock + "'";
      var queryyWareHouseRes = ObjectStore.queryByYonQL(queryWareHouseSql, "productcenter");
      let packageHead = {
        resubmitCheckKey: resubmitCheckKey, //幂等性
        bustype: "A25001", //交易类型--采购要货
        org_code: orgRes.detail.code, //需求组织编码
        vouchdate: selectData.vouchdate, //单据日期
        applyDept: selectData.saleDepartment, //请购部门
        operator: selectData.corpContact, //请购人
        warehouseId_code: queryyWareHouseRes[0].code, //要货仓库
        currency_code: pricesRes.detail.code, //币种简称
        memo: selectData.remarks, //备注
        creator: selectData.creatorName, //创建人20220808
        creatorId: selectData.creatorId,
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
          //自由自定义项
          define1: "终端", //业务属性
          define2: selectData.code, //上游单据号
          define3: selectData.id, //上游主表主键
          define5: selectData.agent, //客户
          define6: selectData.planarrivalDate //交货日期
        },
        _status: "Insert"
      };
      return packageHead;
    }
    let context = request.billdata;
    let param = request.cgList;
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
    let wayfunc = extrequire("GT83441AT1.backDefaultGroup.getWayUrl");
    let wayRes = wayfunc.execute(null);
    var gatewayUrl = wayRes.gatewayUrl;
    let getsdUrl = gatewayUrl + "/yonbip/scm/applyorder/singleSave_v1?access_token=" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });