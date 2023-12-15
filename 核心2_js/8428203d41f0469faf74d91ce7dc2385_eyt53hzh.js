let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let sql = "select * from st.goodchange.GoodChanges where mainid=" + id;
    let goodChanges = ObjectStore.queryByYonQL(sql, "ustock");
    for (let irow = 0; irow < goodChanges.length; irow++) {
      let orderDetail = goodChanges[irow];
      if (null != orderDetail && null != orderDetail.source) {
        let source = orderDetail.source;
        if (source == "82ecba4c" || source == "d15737c7") {
          let sourceautoid = orderDetail.sourceautoid;
          let sourceid = orderDetail.sourceid;
          let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
          var res = AppContext();
          var obj = JSON.parse(res);
          var tid = obj.currentUser.tenantId;
          var token = obj.token;
          let url = "";
          if (source == "82ecba4c") {
            url = apiPreAndAppCode.apiRestPre + "/gsp/stopOrderBackWrite";
          } else {
            if (source == "60360bcd") {
              //冻结单
              url = apiPreAndAppCode.apiRestPre + "/gsp/coolOrderBackWrite";
            } else {
              url = apiPreAndAppCode.apiRestPre + "/gsp/closeOrderBackWrite";
            }
          }
          let sourceids = [];
          if (source == "60360bcd") {
            sourceids.push(sourceid);
          } else {
            sourceids.push(sourceautoid);
          }
          let str_stockstate = orderDetail.inStockStatusDoc;
          let json = { detailids: sourceids, audittype: "1", stockstate: str_stockstate };
          let apiResponse = postman("POST", url, null, JSON.stringify(json));
          let info = JSON.parse(apiResponse);
          if (info.code != 200) {
            throw new Error(JSON.stringify(info.message));
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });