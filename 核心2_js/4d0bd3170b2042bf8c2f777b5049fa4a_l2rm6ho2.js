let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let shopids = request.shopinfos;
    let billnum = request.orderbillnum;
    let entiteurl = request.orderentityurl;
    for (var i = shopids.length - 1; i >= 0; i--) {
      let shopIdenty = shopids[i].shopID; //门店ID
      request.shopIdenty = shopIdenty;
      let func1 = extrequire("GT30233AT436.backDefaultGroup.getkrytoken"); //获取token函数
      let res = func1.execute(request);
      let token = res.access_token;
      request.token = token;
      if (undefined !== token) {
        request.type = 1;
        let orderlistfun = extrequire("GT30233AT436.backDefaultGroup.getOrderList");
        let responcount = orderlistfun.execute(request);
        let totalsize = responcount.responsedata.result.totalRows;
        let maxrows = responcount.responsedata.result.pageSize;
        let tradeNos = [];
        if (Number(totalsize) > Number(maxrows)) {
          let pageSum = Number(totalsize) % Number(maxrows) === 0 ? Number(totalsize) / Number(maxrows) : Number(totalsize) / Number(maxrows) + 1;
          for (var pagenum = 1; pagenum <= pageSum; pagenum++) {
            request.type = 2;
            request.pageNumber = pagenum;
            let inserdata = orderlistfun.execute(request);
            ObjectStore.insertBatch(entiteurl, inserdata, billnum);
            let tradeNos1 = getOrderNo(inserdata);
            tradeNos = tradeNos.concat(tradeNos1);
          }
        } else {
          request.type = 2;
          let responsedata = orderlistfun.execute(request);
          ObjectStore.insertBatch(entiteurl, responsedata, billnum);
          tradeNos = tradeNos.concat(getOrderNo(responsedata));
        }
        if (null !== tradeNos && tradeNos.length > 0) {
          request.tradeNos = tradeNos;
          let orderdetailfun = extrequire("GT30233AT436.backDefaultGroup.processDetailData");
          orderdetailfun.execute(request);
        }
      }
    }
    //门店列表订单ID
    function getOrderNo(items) {
      let tradeNos = [];
      for (var i = 0; i < items.length; i++) {
        tradeNos.push(items[i].orderId);
      }
      return tradeNos;
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });