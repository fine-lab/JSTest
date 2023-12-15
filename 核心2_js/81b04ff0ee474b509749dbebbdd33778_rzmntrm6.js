let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function updateDate(type, salesoutsData) {
      //查询销售发货子表数据
      //查询销售订单子表数据
      let queryXSDDbody = "select * from voucher.order.OrderDetail where id=" + salesoutsData.sourceautoid;
      let xsddResboy = ObjectStore.queryByYonQL(queryXSDDbody, "udinghuo");
      if (xsddResboy.length > 0) {
        let orderDetail = xsddResboy[0];
        //查询销售订单子表对应的自由自定义项
        let queryXSDDZDYbody = "select * from voucher.order.OrderDetailFreeDefine where id=" + orderDetail.id;
        let xsyddzdyResbody = ObjectStore.queryByYonQL(queryXSDDZDYbody, "udinghuo");
        if (xsyddzdyResbody.length > 0) {
          let xsyddzdyData = xsyddzdyResbody[0];
          //查询销售预订单子表
          let queryXSYDDbody = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where id=" + xsyddzdyData.define3;
          let xsyddResbody = ObjectStore.queryByYonQL(queryXSYDDbody, "developplatform");
          if (xsyddResbody.length > 0) {
            let xsyddDatabody = xsyddResbody[0];
            let lastQty = xsyddDatabody.totalsubQty === undefined ? 0 : Number(xsyddDatabody.totalsubQty);
            if (type == "add") {
              lastQty = lastQty + salesoutsData.qty;
            } else if (type == "delete") {
              lastQty = lastQty - salesoutsData.qty;
            }
            var body = { billid: xsyddDatabody.salesAdvanceOrder_id, bodyid: xsyddDatabody.id, totalsubQty: lastQty };
            return body;
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
    let getExchangerate = "https://www.example.com/" + token;
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