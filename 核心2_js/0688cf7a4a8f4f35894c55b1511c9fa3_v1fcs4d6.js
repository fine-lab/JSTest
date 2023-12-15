let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function updateDate(type, purInRecordsData) {
      //查询采购到货单
      let queryCGDHDbody = "select * from pu.arrivalorder.ArrivalOrders where id=" + purInRecordsData.sourceautoid;
      let cgdhdResbody = ObjectStore.queryByYonQL(queryCGDHDbody, "upu");
      if (cgdhdResbody.length > 0) {
        let arrivalOrders = cgdhdResbody[0];
        //查询采购订单子表数据
        let queryCGDDbody = "select * from pu.purchaseorder.PurchaseOrders where id=" + arrivalOrders.sourceautoid;
        let cgddResbody = ObjectStore.queryByYonQL(queryCGDDbody, "upu");
        if (cgddResbody.length > 0) {
          let purchaseOrders = cgddResbody[0];
          //查询请购单子表数据
          let queryQGDbody = "select * from pu.applyorder.ApplyOrders where id=" + purchaseOrders.sourceautoid;
          let qgdResboy = ObjectStore.queryByYonQL(queryQGDbody, "upu");
          if (qgdResboy.length > 0) {
            let applyOrders = qgdResboy[0];
            //查询请购单子表自由自定义数据
            if (applyOrders.applyOrdersDefineCharacter.attrext11 != null) {
              //查询销售预订单子表
              let queryXSYDDbody = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where id='" + applyOrders.applyOrdersDefineCharacter.attrext11 + "'";
              let xsyddResbody = ObjectStore.queryByYonQL(queryXSYDDbody, "developplatform");
              if (xsyddResbody.length > 0) {
                let xsyddDatabody = xsyddResbody[0];
                let lastQty = xsyddDatabody.totalpurcQty === undefined ? 0 : Number(xsyddDatabody.totalpurcQty);
                if (type == "add") {
                  lastQty = lastQty + purInRecordsData.qty;
                } else if (type == "delete") {
                  lastQty = lastQty - purInRecordsData.qty;
                }
                var body = { billid: xsyddDatabody.salesAdvanceOrder_id, bodyid: xsyddDatabody.id, totalpurcQty: lastQty };
                return body;
              }
            }
          }
        }
      }
    }
    let func1 = extrequire("ST.backDefaultGroup.getApitoken");
    let resToken = func1.execute();
    var token = resToken.access_token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let wayfunc = extrequire("GT83441AT1.backDefaultGroup.getWayUrl");
    let wayRes = wayfunc.execute(null);
    var gatewayUrl = wayRes.gatewayUrl;
    let getExchangerate = gatewayUrl + "/v1fcs4d6/atFuturecargo/advanceOrderAPI/update?access_token=" + token;
    //缓存数据
    var cachrows = request.cachrows;
    if (cachrows !== undefined) {
      for (var i = 0; i < cachrows.length; i++) {
        let cachbody = updateDate("delete", cachrows[i]);
        if (cachbody != null) {
          let rateResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(cachbody));
          let rateresponseobj = JSON.parse(rateResponse);
          if (rateresponseobj.code != "200") {
            let errorMessage = "回写销售预订单失败：" + rateresponseobj.message;
            throw new Error(errorMessage);
          }
        }
      }
    }
    //界面数据
    var rows = request.rows;
    for (var j = 0; j < rows.length; j++) {
      let rowbody = updateDate("add", rows[j]);
      if (rowbody != null) {
        let rowResponse = postman("POST", getExchangerate, JSON.stringify(header), JSON.stringify(rowbody));
        let rowobj = JSON.parse(rowResponse);
        if (rowobj.code != "200") {
          let errorMessage = "回写销售预订单失败：" + rowobj.message;
          throw new Error(errorMessage);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });