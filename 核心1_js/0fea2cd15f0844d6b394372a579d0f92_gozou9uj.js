let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(orders, vendor, billCode) {
    var tenantId = JSON.parse(AppContext()).currentUser.tenantId;
    let sql = `select *,(select * from batch_price_detailList) batch_price_detailList from GT18AT2.GT18AT2.batch_price where supplier = '${vendor}' AND verifystate = 2 order by batch_time`;
    var batchList = ObjectStore.queryByYonQL(sql, "developplatform");
    let order_batch_detail_ids = orders.map((item) => item.extend119);
    for (let i = 0; i < batchList.length; i++) {
      let { batch_price_detailList, id: batch_id } = batchList[i];
      for (let j = 0; j < batch_price_detailList.length; j++) {
        let { id: detail_id, orders_arr } = batch_price_detailList[j];
        if (order_batch_detail_ids.includes(detail_id) && orders_arr) {
          let orderArr = JSON.parse(orders_arr);
          for (let k = 0; k < orderArr.length; k++) {
            if (Object.keys(orderArr[k])[0] === billCode) {
              let order = orders.find((od) => od.id === Object.values(orderArr[k])[0]);
              if (order) {
                batch_price_detailList[j]["ordered_num"] -= order.qty;
                batch_price_detailList[j]["remain_num"] += order.qty;
                batch_price_detailList[j]["_status"] = "Update";
                batchList[i]["remain_total"] += order.qty;
                batchList[i].updated = true;
                orderArr.splice(k, 1);
                k--;
              }
            }
          }
          batch_price_detailList[j]["orders_arr"] = JSON.stringify(orderArr);
          // 获得orderArr里的所有key(billCode)，可能包含重复key
          let mulitArr = orderArr.map((item) => Object.keys(item)[0]);
          batch_price_detailList[j]["order_codes"] = [...new Set(mulitArr)].join(",");
        }
      }
    }
    let batchListReq = [];
    for (let i = 0; i < batchList.length; i++) {
      if (batchList[i].updated) {
        let { batch_price_detailList, id: batch_id } = batchList[i];
        let detailList = [];
        for (let j = 0; j < batch_price_detailList.length; j++) {
          detailList.push({
            ordered_num: batch_price_detailList[j]["ordered_num"],
            remain_num: batch_price_detailList[j]["remain_num"],
            _status: batch_price_detailList[j]["_status"],
            orders_arr: batch_price_detailList[j]["orders_arr"],
            order_codes: batch_price_detailList[j]["order_codes"],
            id: batch_price_detailList[j]["id"]
          });
        }
        batchListReq.push({
          id: batch_id,
          remain_total: batchList[i]["remain_total"],
          batch_price_detailList: detailList
        });
      }
    }
    let envUrl = ObjectStore.env().url;
    let url2 = `${envUrl}/iuap-api-gateway/${tenantId}/product_ref/product_ref_01/updateBatchList`;
    let apiResponse = openLinker("POST", url2, "PU", JSON.stringify(batchListReq));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });