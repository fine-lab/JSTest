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
      var sql = "select * from GT46163AT1.GT46163AT1.salesprereturnxq where dr=0 and salesprereturn_id=" + row.id;
      var rst = ObjectStore.queryByYonQL(sql);
      let orderDetails = [];
      for (var j = 0; j < rst.length; j++) {
        var wl = rst[j];
        var xsdwBody = {
          pageIndex: 1,
          pageSize: 10,
          simple: {
            name: wl.ziduan30
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
            name: wl.xiaoshoudanwei
          }
        };
        var jijiarst = "";
        let jijiaResponse = postman("POST", reqjiliangdanweiURL, JSON.stringify(header), JSON.stringify(jijiaBody));
        let jijiaresponseobj = JSON.parse(jijiaResponse);
        if ("200" == jijiaresponseobj.code) {
          jijiarst = jijiaresponseobj.data;
        }
        var jijiarstList = jijiarst.recordList;
        var detail = {
          productId: wl.kehubianma,
          skuId: wl.skubianma,
          unitExchangeType: "0",
          unitExchangeTypePrice: "0",
          stockOrgId: row.xiaoshouzuzhibianma,
          iProductAuxUnitId: jijiarstList[0].code,
          iProductUnitId: jijiarstList[0].code,
          masterUnitId: xsdwrstList[0].code,
          invExchRate: wl.xiaoshouhuansuanlv,
          subQty: wl.tuihuoxiaoshoushuliang,
          invPriceExchRate: wl.ziduan28,
          priceQty: wl.tuihuojijiashuliang,
          qty: wl.tuihuoshuliang,
          oriTaxUnitPrice: wl.hanshuichengjiaojia,
          oriUnitPrice: wl.wushuidanjia,
          oriSum: wl.hanshuijine,
          oriMoney: wl.ziduan47,
          taxRate: wl.shuilv,
          oriTax: wl.shuie,
          natTaxUnitPrice: wl.hanshuichengjiaojia,
          natUnitPrice: wl.wushuidanjia,
          natSum: wl.hanshuijine,
          natMoney: wl.ziduan47,
          natTax: wl.shuie,
          "bodyFreeItem!define1": wl.kaidanjia,
          _status: "Insert",
          stockId: wl.tuihuocangku,
          stockName: wl.tuihuocangku_name,
          "bodyItem!define1": wl.marked_remarks
        };
        orderDetails.push(detail);
      }
      body = {
        data: {
          resubmitCheckKey: replace(uuid(), "-", ""),
          salesOrgId: row.xiaoshouzuzhibianma,
          transactionTypeId: "yourIdHere",
          vouchdate: row.danjuriqi,
          agentId: row.kehu,
          settlementOrgId: row.xiaoshouzuzhibianma,
          currency: "CNY",
          exchRate: "1",
          exchangeRateType: "01",
          natCurrency: "CNY",
          taxInclusive: "true",
          saleReturnStatus: "SUBMITSALERETURN",
          saleReturnSourceType: "NONE",
          invoiceAgentId: row.kaipiaokehu,
          payMoney: row.zongjine,
          saleReturnDetails: orderDetails,
          creator: row.creator_userName,
          bizFlow: "d0c026b6-ff20-11eb-8c0b-98039b073634",
          _status: "Insert",
          "headItem!define3": row.xiaoshoutuihuoleixing == "001" ? "物料回空" : "商品退货",
          "headItem!define2": row.feiyongfenlei === undefined ? "" : row.feiyongfenlei,
          "headItem!define1": row.feiyongfenleimingxi === undefined ? "" : row.feiyongfenleimingxi
        }
      };
      var xtrst = "";
      let xtResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(body));
      let xtresponseobj = JSON.parse(xtResponse);
      if ("200" == xtresponseobj.code) {
        var updateObject = { id: row.id, is_xt: "已下推" };
        ObjectStore.updateById("GT46163AT1.GT46163AT1.salesprereturn", updateObject);
      } else {
        sbcodes.push(row.code, xtresponseobj.message);
        continue;
      }
    }
    return { sbcodes };
  }
}
exports({ entryPoint: MyAPIHandler });