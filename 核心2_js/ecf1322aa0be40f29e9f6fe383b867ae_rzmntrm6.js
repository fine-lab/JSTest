let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    function updateDate(type, detailsData) {
      //查询调拨出库子表数据
      let queryDBCKbody = "select * from st.storeout.StoreOutDetail where id=" + detailsData.sourceautoid;
      let dbckResbody = ObjectStore.queryByYonQL(queryDBCKbody, "ustock");
      if (dbckResbody.length > 0) {
        let storeOutDetail = dbckResbody[0];
        //查询调拨订单子表数据
        let queryDBDDbody = "select * from st.transferapply.TransferApplys where id=" + storeOutDetail.sourceautoid;
        let dbddResboy = ObjectStore.queryByYonQL(queryDBDDbody, "ustock");
        if (dbddResboy.length > 0) {
          let transferApplys = dbddResboy[0];
          //查询调拨订单子表自由自定义项数据
          let queryDBDDZYDbody = "select * from st.transferapply.TransferApplysAttrextItem where id=" + transferApplys.id;
          let dbddzdyResboy = ObjectStore.queryByYonQL(queryDBDDZYDbody, "ustock");
          if (dbddzdyResboy.length > 0) {
            let dbddzdyData = dbddzdyResboy[0];
            //查询销售预订单子表
            let queryXSYDDbody = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where id=" + dbddzdyData.define3;
            let xsyddResbody = ObjectStore.queryByYonQL(queryXSYDDbody, "developplatform");
            if (xsyddResbody.length > 0) {
              let xsyddDatabody = xsyddResbody[0];
              let lastQty = xsyddDatabody.totaltranQty === undefined ? 0 : Number(xsyddDatabody.totaltranQty);
              if (type == "add") {
                lastQty = lastQty + detailsData.qty;
              } else if (type == "delete") {
                lastQty = lastQty - detailsData.qty;
              }
              var body = { billid: xsyddDatabody.salesAdvanceOrder_id, bodyid: xsyddDatabody.id, totaltranQty: lastQty };
              return body;
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