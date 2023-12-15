let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sccess_info = [];
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    //查询现存量
    let url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/stock/QueryCurrentStocksByCondition";
    let body = { warehouse: request.warehouse, product: request.p_id, batchno: request.batchno };
    let res = openLinker("POST", url, apiPreAndAppCode.appCode, JSON.stringify(body));
    let response = JSON.parse(res).data;
    //查询批次号
    let batchSql = "select producedate,invaliddate from st.batchno.Batchno where id =	'" + request.batchId + "'";
    let batchRes = ObjectStore.queryByYonQL(batchSql, "ustock");
    if (typeof response != "undefined" && response != null && response != "null") {
      if (response.length > 1) {
        for (let i = 0; i < response.length; i++) {
          for (let j = i + 1; j < response.length; j++) {
            let stockStatusRes = [];
            if (typeof response[i].stockStatusDoc != "undefined") {
              let stockStatusSql = "select id,statusName from st.stockStatusRecord.stockStatusRecord where id =	'" + response[i].stockStatusDoc + "'";
              stockStatusRes = ObjectStore.queryByYonQL(stockStatusSql, "ustock");
            }
            if (stockStatusRes.length > 0) {
              if (response[i].currentqty <= 0 || stockStatusRes[0].statusName != "合格") {
                response.splice(j, 1);
                j--;
                continue;
              } else if (response[i].currentqty > 0 && stockStatusRes[0].statusName == "合格") {
                sccess_info.push({
                  statusId: stockStatusRes[0].id,
                  statusName: stockStatusRes[0].statusName,
                  currentqty: response[i].currentqty,
                  manufacture_date: batchRes[0].producedate,
                  due_date: batchRes[0].invaliddate
                });
              }
            }
          }
        }
      } else {
        let stockStatusRes = [];
        if (typeof response[0].stockStatusDoc != "undefined") {
          let stockStatusSql = "select id,statusName from st.stockStatusRecord.stockStatusRecord where id =	'" + response[0].stockStatusDoc + "'";
          stockStatusRes = ObjectStore.queryByYonQL(stockStatusSql, "ustock");
        }
        if (stockStatusRes.length > 0) {
          if (response[0].currentqty > 0 && stockStatusRes[0].statusName == "合格") {
            sccess_info.push({
              statusId: stockStatusRes[0].id,
              statusName: stockStatusRes[0].statusName,
              currentqty: response[0].currentqty,
              manufacture_date: batchRes[0].producedate,
              due_date: batchRes[0].invaliddate
            });
          }
        }
      }
    }
    return { sccess_info };
  }
}
exports({ entryPoint: MyAPIHandler });