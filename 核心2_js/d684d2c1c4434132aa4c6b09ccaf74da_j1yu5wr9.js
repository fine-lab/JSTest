let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rows = request.rows;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var reqjiliangdanweiURL = "https://www.example.com/" + token;
    var requrl = "https://www.example.com/" + token;
    //根据税率查询税目
    var rateUrl = "https://www.example.com/" + token;
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
      var sql = "select * from GT46163AT1.GT46163AT1.transfer_wl where dr=0 and salesprereturn_id=" + row.id;
      var rst = ObjectStore.queryByYonQL(sql);
      let orderDetails = [];
      for (var j = 0; j < rst.length; j++) {
        var wl = rst[j];
        var xsdwBody = {
          pageIndex: 1,
          pageSize: 10,
          simple: {
            name: wl.zujil
          }
        };
        var xsdwrst = "";
        let xsdwResponse = postman("POST", reqjiliangdanweiURL, JSON.stringify(header), JSON.stringify(xsdwBody));
        let xsdwresponseobj = JSON.parse(xsdwResponse);
        if ("200" == xsdwresponseobj.code) {
          xsdwrst = xsdwresponseobj.data;
        }
        var xsdwrstList = xsdwrst.recordList;
        var raterst = "";
        let rateResponse = postman("GET", rateUrl + "&taxRate=" + wl.shuilv, JSON.stringify(header), null);
        let rateresponseobj = JSON.parse(rateResponse);
        if ("200" == rateresponseobj.code) {
          raterst = rateresponseobj.data;
        }
        var detail = {
          product: wl.wl_id,
          productsku: wl.wuliaosku,
          qty: wl.number,
          invExchRate: wl.xiaoshouhuansuanlv,
          subQty: wl.jianshunew,
          oriUnitPrice: wl.wushuidanjia,
          oriTaxUnitPrice: wl.hanshuichengdanjia,
          oriMoney: wl.ziduan47,
          oriSum: wl.hanshuijine,
          oriTax: wl.shuie,
          taxRate: raterst[0].code,
          unit: xsdwrstList[0].id,
          stockUnitId: wl.kucundanweiid,
          _status: "Insert",
          //计价单位
          priceUOM: wl.kucundanweiid,
          //计价换算率
          invPriceExchRate: wl.xiaoshouhuansuanlv,
          //计价数量
          priceQty: wl.jianshunew,
          unitExchangeType: 0,
          "bodyItem!define1": wl.marked_remarks
        };
        orderDetails.push(detail);
      }
      body = {
        data: {
          outorg: row.diaochuzuzhi,
          outaccount: row.diaochuzuzhi,
          outstore: row.diaochumendianxin,
          outwarehouse: row.Warehouse,
          code: row.code,
          vouchdate: row.danjuriqinew,
          bustype: "2373135715963680",
          inorg: row.SalesOrgVO,
          inaccount: row.SalesOrgVO,
          inwarehouse: row.diaorucangku,
          instore: row.diaorumendiannew,
          status: "0",
          dplanshipmentdate: row.danjuriqinew,
          dplanarrivaldate: row.danjuriqinew,
          _status: "Insert",
          transferApplys: orderDetails,
          creator: row.creator_userName,
          settlementAccount: row.diaochuzuzhi,
          settlementAccount_name: row.diaochuzuzhi_name,
          currency: "2373135719225088",
          "headItem!define1": row.feiyongfenleiguding,
          "headItem!define2": row.feiyongfenleimingxiguding
        }
      };
      var xtrst = "";
      let xtResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(body));
      let xtresponseobj = JSON.parse(xtResponse);
      let responseData = xtresponseobj.data;
      if ("200" == xtresponseobj.code && responseData.failCount == 0) {
        var updateObject = { id: row.id, is_xt: "1" };
        ObjectStore.updateById("GT46163AT1.GT46163AT1.transfer_order", updateObject);
      } else {
        sbcodes.push(row.code, xtresponseobj.message);
        continue;
      }
    }
    return { sbcodes };
  }
}
exports({ entryPoint: MyAPIHandler });