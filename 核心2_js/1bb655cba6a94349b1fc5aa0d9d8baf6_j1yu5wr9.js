let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rows = request.rows;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var reqjiliangdanweiURL = "https://www.example.com/" + token;
    var requrl = "https://www.example.com/" + token;
    //获取下游来源单据是否有上游单据
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var sbcodes = [];
    let body = "";
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var sql = "select * from GT46163AT1.GT46163AT1.order_b	where dr=0 and sales_advance_order_id=" + row.id;
      var rst = ObjectStore.queryByYonQL(sql);
      let orderDetails = [];
      for (var j = 0; j < rst.length; j++) {
        var wl = rst[j];
        var xsdwBody = {
          pageIndex: 1,
          pageSize: 10,
          simple: {
            name: wl.xiaoshoudanwei
          }
        };
        var xsdwrst = "";
        let xsdwResponse = postman("POST", reqjiliangdanweiURL, JSON.stringify(header), JSON.stringify(xsdwBody));
        let xsdwresponseobj = JSON.parse(xsdwResponse);
        if ("200" == xsdwresponseobj.code) {
          xsdwrst = xsdwresponseobj.data;
        }
        var xsdwrstList = xsdwrst.recordList;
        var jijiaBody = {
          pageIndex: 1,
          pageSize: 10,
          simple: {
            name: wl.jijiadanweimingchen
          }
        };
        var jijiarst = "";
        let jijiaResponse = postman("POST", reqjiliangdanweiURL, JSON.stringify(header), JSON.stringify(jijiaBody));
        let jijiaresponseobj = JSON.parse(jijiaResponse);
        if ("200" == jijiaresponseobj.code) {
          jijiarst = jijiaresponseobj.data;
        }
        var jijiarstList = jijiarst.recordList;
        var orgid = row.sales_org_name;
        var productId = wl.shangpinbianma;
        var param = { orgid, productId };
        let func2 = extrequire("GT46163AT1.backDefaultGroup.getTaxCode");
        let res2 = func2.execute(param);
        if (res2.tax.length == 0) {
          sbcodes.push("查询税率信息失败！");
          return { sbcodes };
        }
        var detail = {
          //本币含税金额
          "orderDetailPrices!natSum": wl.hanshuijine,
          //本币无税金额
          "orderDetailPrices!natMoney": wl.wushuijine,
          //商品
          productId: wl.shangpinbianma,
          //主计量单位
          masterUnitId: wl.zhujiliangdanweiid,
          //销售换算率
          invExchRate: wl.xiaoshouhuansuanlv,
          //浮动
          unitExchangeTypePrice: "0",
          //税额
          "orderDetailPrices!oriTax": wl.shuie,
          //销售单位
          iProductAuxUnitId: xsdwrstList[0].code,
          //本币无税单价
          "orderDetailPrices!natUnitPrice": wl.wushuichengjiaojia,
          //计价换算率
          invPriceExchRate: wl.jijiahuansuanlv,
          //含税金额
          oriSum: wl.hanshuijine,
          //无税金额
          "orderDetailPrices!oriMoney": wl.wushuijine,
          //计价数量
          priceQty: wl.jijiashuliang,
          //库存组织
          stockOrgId: wl.kucunzuzhi,
          //计价单位
          iProductUnitId: jijiarstList[0].code,
          //本币含税单价
          "orderDetailPrices!natTaxUnitPrice": wl.hanshuichengjiaojia,
          //商品售卖类型
          orderProductType: wl.orderProductType,
          //销售数量
          subQty: wl.xshlxin,
          //计价发货日期
          consignTime: wl.jihuafahuoriqi,
          //商品sku
          skuId: wl.skuid,
          //税率
          taxRate: wl.shuilv,
          //税率id
          taxId: res2.tax[1],
          //税率code
          taxCode: res2.tax[0],
          //数量
          qty: wl.ziduan29,
          //开票组织
          settlementOrgId: row.xiaoshouzuzhibianma,
          //含税成交价
          oriTaxUnitPrice: wl.hanshuichengjiaojia,
          //本币税额
          "orderDetailPrices!natTax": wl.benbishuie,
          //浮动计价
          unitExchangeType: "0",
          //无税成交价
          "orderDetailPrices!oriUnitPrice": wl.wushuichengjiaojia,
          "bodyItem!define9": wl.kaipiaojine,
          "bodyItem!define1": wl.youbiaobeizhu,
          _status: "Insert",
          "bodyFreeItem!define1": wl.kaidanjia,
          stockId: wl.Warehouse,
          stockName: wl.Warehouse_name,
          prodPrice: wl.hanshuichengjiaojia,
          prodCost: wl.hanshuijine
        };
        orderDetails.push(detail);
      }
      body = {
        data: {
          resubmitCheckKey: replace(uuid(), "-", ""),
          code: row.code,
          salesOrgId: row.xiaoshouzuzhibianma,
          transactionTypeId: "yourIdHere",
          vouchdate: row.ziduan7,
          agentId: row.kehubianma,
          settlementOrgId: row.xiaoshouzuzhibianma,
          "orderPrices!currency": "CNY",
          "orderPrices!exchRate": "1",
          "orderPrices!exchangeRateType": "01",
          "orderPrices!natCurrency": "CNY",
          "orderPrices!taxInclusive": "true",
          invoiceAgentId: row.kaipiaokehu,
          //业务员
          corpContact: row.xiaoshouyewuyuan,
          //流程
          bizFlow: "d1daaf49-ff20-11eb-8c0b-98039b073634",
          //客户备注
          "headItem!define5": row.kehubeizhu,
          receiveMobile: row.yingyedianhua,
          receiveAddress: row.yingyedizhi,
          invoiceUpcType: row.fapiaoleixing,
          payMoney: row.hanshuijine,
          orderDetails: orderDetails,
          creator: row.creator_userName,
          _status: "Insert",
          "headFreeItem!define11": row.code,
          "headItem!define3": row.xiaoshoudingdanleixing == "001" ? "正常" : "订货会",
          "headItem!define1": row.xiaoshoufenleiguding === undefined ? "" : row.xiaoshoufenleiguding,
          "headItem!define2": row.expense_classification_details === undefined ? "" : row.expense_classification_details
        }
      };
      var xtrst = "";
      let xtResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(body));
      let xtresponseobj = JSON.parse(xtResponse);
      if ("200" == xtresponseobj.code) {
        var updateObject = { id: row.id, is_xt: "已下推" };
        ObjectStore.updateById("GT46163AT1.GT46163AT1.sale_advance_order", updateObject);
      } else {
        sbcodes.push(row.code, xtresponseobj.message);
        continue;
      }
    }
    return { sbcodes };
  }
}
exports({ entryPoint: MyAPIHandler });