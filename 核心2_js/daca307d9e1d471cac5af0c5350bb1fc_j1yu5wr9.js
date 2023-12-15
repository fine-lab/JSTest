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
      var sql = "select * from GT46163AT1.GT46163AT1.material_0906	where dr=0 and purchase_order_new_id=" + row.id;
      var rst = ObjectStore.queryByYonQL(sql);
      let purchaseOrders = [];
      for (var j = 0; j < rst.length; j++) {
        var wl = rst[j];
        var utitBody = {
          pageIndex: 1,
          pageSize: 10,
          simple: {
            name: wl.master_metering
          }
        };
        var utitrst = "";
        let unitResponse = postman("POST", reqjiliangdanweiURL, JSON.stringify(header), JSON.stringify(utitBody));
        let unitresponseobj = JSON.parse(unitResponse);
        if ("200" == unitresponseobj.code) {
          utitrst = unitresponseobj.data;
        }
        var utitrstList = utitrst.recordList;
        var purBody = {
          pageIndex: 1,
          pageSize: 10,
          simple: {
            name: wl.purchase_company
          }
        };
        var purrst = "";
        let purResponse = postman("POST", reqjiliangdanweiURL, JSON.stringify(header), JSON.stringify(purBody));
        let purresponseobj = JSON.parse(purResponse);
        if ("200" == purresponseobj.code) {
          purrst = purresponseobj.data;
        }
        var purrstList = purrst.recordList;
        var detail = {
          //收票组织编码
          inInvoiceOrg_code: row.org_code,
          //收货组织编码
          inOrg_code: row.org_code,
          //需求组织编码
          demandOrg_code: row.org_code,
          //采购换算率
          invExchRate: wl.caigouhuansuanlv,
          //本币无税金额
          natMoney: wl.hanshuijine,
          //本币含税金额
          natSum: wl.hanshuijine,
          //本币税额
          natTax: wl.shuie,
          //本币含税单价
          natTaxUnitPrice: wl.price_tax,
          //本币无税单价
          natUnitPrice: wl.price_tax,
          //无税金额
          oriMoney: wl.hanshuijine,
          //含税金额
          oriSum: wl.hanshuijine,
          //税额
          oriTax: wl.shuie,
          //含税单价
          oriTaxUnitPrice: wl.price_tax,
          //无税单价
          oriUnitPrice: wl.price_tax,
          //税率
          taxRate: wl.rate,
          //计价数量
          priceQty: wl.valuation_num,
          //物料编码
          product_cCode: wl.wuliaobianmacode,
          //计价单位编码
          priceUOM_Code: purrstList[0].code,
          //采购单位编码
          purUOM_Code: purrstList[0].code,
          //数量
          qty: wl.quantity,
          //采购数量
          subQty: wl.purchase_quantity,
          //计价换算率方式
          unitExchangeTypePrice: "0",
          //采购单位换算率方式
          unitExchangeType: "0",
          //计价换算率
          invPriceExchRate: wl.valuation_rate,
          //主计量编码
          unit_code: utitrstList[0].code,
          _status: "Insert",
          warehouse: wl.cangku,
          warehouse_name: wl.cangku_name,
          "bodyItem!define4": wl.tijiachajia,
          "bodyItem!define2": wl.jinhuojia,
          "bodyItem!define3": wl.fanli,
          "bodyItem!define5": MoneyFormatReturnBd(wl.jinhuojia * wl.purchase_quantity, 2),
          "bodyItem!define6": MoneyFormatReturnBd(wl.fanli * wl.purchase_quantity, 2),
          "bodyItem!define7": MoneyFormatReturnBd(wl.tijiachajia * wl.purchase_quantity, 2),
          "bodyItem!define8": wl.shengchanriqi,
          taxitems: wl.tax_item_code,
          taxitems_code: wl.tax_item_code_code,
          taxitems_name: wl.tax_item_name
        };
        purchaseOrders.push(detail);
      }
      body = {
        data: {
          resubmitCheckKey: replace(uuid(), "-", ""),
          bustype_code: "A20002",
          currency_code: "CNY",
          code: row.code,
          exchRate: "1",
          exchRateType: "01",
          invoiceVendor_code: row.vendor_code,
          natCurrency_code: "CNY",
          org_code: row.org_code,
          purchaseOrders: purchaseOrders,
          _status: "Insert",
          vendor_code: row.vendor_code,
          vouchdate: row.cg_date,
          bizFlow: "d0c827a4-ff20-11eb-8c0b-98039b073634",
          creator: row.creator_userName
        }
      };
      var xtrst = "";
      let xtResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(body));
      let xtresponseobj = JSON.parse(xtResponse);
      if ("200" == xtresponseobj.code) {
        var updateObject = { id: row.id, shifuxiatui: "1" };
        ObjectStore.updateById("GT46163AT1.GT46163AT1.purchase_order_0906", updateObject);
      } else {
        sbcodes.push(row.code, xtresponseobj.message);
        continue;
      }
    }
    return { sbcodes };
  }
}
exports({ entryPoint: MyAPIHandler });