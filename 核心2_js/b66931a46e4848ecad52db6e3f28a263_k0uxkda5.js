let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let allpushdata = getpushData(request);
    return { allpushdata };
    function getpushData(param) {
      let allpushdata = {};
      let data = param.needpushdata;
      let store = data.store;
      if (data.hasOwnProperty("details") && data.details.length > 0) {
        let datadetails = data.details;
        let stockorg = data.org; //库存组织
        let orgID = data.salesOrg; //销售组织
        let iWarehouseid = data.warehouse; //门店仓库id
        let transferApplys = new Array();
        let transferApplys1 = new Array();
        let othInRecords = new Array();
        let errormessage = "";
        let productidmap = new Map();
        let productidsstr = "";
        for (let i = 0; i < datadetails.length; i++) {
          let productID = datadetails[i].product; //商品id
          productidmap.set(productID, datadetails[i]);
          productidsstr = productidsstr + "'" + productID + "',";
        }
        let productids = productidsstr.substring(0, productidsstr.length - 1);
        let salemap = queryaccmaterialOrgIDAndJSType1(productids);
        let availableqtymap = queryAvailableqty1(store, iWarehouseid, productids); //可用量
        let safestockmap1 = querySafeStock1(data, orgID, iWarehouseid, productids, "", errormessage);
        let productpricemap = getPriceByProductMap(productids);
        for (let key of productidmap.keys()) {
          let isConsignment = "代售结算商品" == salemap.get(key); //是否为代售结算商品
          if (isConsignment) {
            let availableqty = undefined != availableqtymap.get(key) && null != availableqtymap.get(key) && "" != availableqtymap.get(key) ? availableqtymap.get(key) : 0;
            //查询安全库存上下线
            let safestockmap = undefined != safestockmap1.get(key) && null != safestockmap1.get(key) ? safestockmap1.get(key) : 0;
            let detail = productidmap.get(key);
            if (detail.qty > availableqty - safestockmap.get("XX")) {
              //需要调拨数量
              let needqty = detail.qty + safestockmap.get("SX") - availableqty;
              let transferApply = genertransferApplys(detail, needqty, stockorg, productpricemap);
              transferApplys.push(transferApply);
              let transferApply1 = genertransferApplys(detail, detail.qty, stockorg, productpricemap);
              transferApplys1.push(transferApply1);
              let otherinrecord = generOtherInRecords(detail, needqty);
              othInRecords.push(otherinrecord);
            }
          }
        }
        if (othInRecords.length > 0) {
          let warehouse = querywarehouse("", data.org, "", errormessage);
          let otherdata = {
            data: data,
            warehouse: warehouse,
            othInRecords: othInRecords
          };
          allpushdata.otherdata = otherdata;
        }
        if (transferApplys.length > 0) {
          let wheresql = " and code like 'G'";
          let outwarehouse = querywarehouse("", stockorg, wheresql, errormessage);
          let transferapply = {
            data: data,
            stockorg: stockorg,
            outwarehouse: outwarehouse,
            iWarehouseid: iWarehouseid,
            transferApplys: transferApplys
          };
          allpushdata.transferapply = transferapply;
          let transferapply1 = {
            data: data,
            stockorg: stockorg,
            outwarehouse: outwarehouse,
            iWarehouseid: iWarehouseid,
            transferApplys1: transferApplys1
          };
          allpushdata.transferapply1 = transferapply1;
        }
      }
      return allpushdata;
    }
    //查询库存仓库
    function querywarehouse(iWarehouseid_name, orgID, wheresql, errormessage) {
      let queryWarehouseSql = "select id from aa.warehouse.Warehouse where org='" + orgID + "' and iUsed='enable'  " + wheresql;
      let warehouseRes = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
      let warehouse = "";
      if (warehouseRes.length == 0) {
        errormessage = "【仓库】：" + iWarehouseid_name + "无对应的供应商仓库";
      } else {
        warehouse = warehouseRes[0].id;
      }
      return warehouse;
    }
    function queryaccmaterialOrgIDAndJSType1(productIDs) {
      let productmap = new Map();
      let sql = "select * from 		pc.product.ProductFreeDefine	where  id in(" + productIDs + ")";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      if (undefined != res && res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          var id = undefined != res[j].id ? res[j].id : "";
          var define4 = undefined != res[j].define4 ? res[j].define4 : "";
          productmap.set(id, define4);
        }
      }
      return productmap;
    }
    function queryAvailableqty1(store, iWarehouseid, productID) {
      let sql = "select * from stock.currentstock.CurrentStock where  store='" + store + "'  and warehouse='" + iWarehouseid + "' and  product in(" + productID + ")";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      let safestockmap = new Map();
      if (undefined != res && res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          let product = res[j].product;
          if (undefined != safestockmap.get(product) && null != safestockmap.get(product)) {
            let availableqty = safestockmap.get(product);
            safestockmap.set(product, availableqty + res[j].currentqty);
          } else {
            safestockmap.set(product, res[j].currentqty);
          }
        }
      }
      return safestockmap;
    }
    function querySafeStock1(requestData, orgId, stockId, productID, product_cName, errormessage) {
      let sql = "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" + stockId + "' and wuliao in(" + productID + ") and org = '" + orgId + "'";
      let res = ObjectStore.queryByYonQL(sql, "developplatform");
      let safestockmap = new Map();
      if (undefined != res && res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          let safestockmap1 = new Map();
          let wuliao = res[j].wuliao;
          //下限库存
          let XX = res[j].xiaxiananquankucun;
          //上限库存
          let SX = res[j].shangxiananquankucun;
          safestockmap1.set("SX", SX);
          safestockmap1.set("XX", XX);
          safestockmap.set(wuliao, safestockmap1);
        }
      }
      return safestockmap;
    }
    function genertransferApplys(retailVouchDetails, needqty, supply, productpricemap) {
      let price = productpricemap.get(retailVouchDetails.product) == null || undefined == productpricemap.get(retailVouchDetails.product) ? 1 : productpricemap.get(retailVouchDetails.product);
      let taxRatevalue = 0;
      let oriSum = needqty * price;
      let transferApplys = {
        product: retailVouchDetails.product,
        qty: needqty,
        unit: retailVouchDetails.unit,
        priceUOM: retailVouchDetails.priceUOM,
        stockUnitId: retailVouchDetails.stockUnitId,
        priceQty: needqty,
        invPriceExchRate: 1,
        subQty: needqty,
        taxRate: "NL",
        invExchRate: retailVouchDetails.invExchRate,
        oriTaxUnitPrice: price,
        oriUnitPrice: price / (1 + taxRatevalue),
        oriMoney: oriSum / (1 + taxRatevalue),
        oriSum: oriSum,
        oriTax: oriSum - oriSum / (1 + taxRatevalue),
        _status: "Insert"
      };
      return transferApplys;
    }
    function getPriceByProductMap(productIDs) {
      let safestockmap = new Map();
      let querysql = "select vmaterialId,nprice taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vmaterialId in(" + productIDs + ")  order by dbilldate desc";
      let queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      if (queryRest.length > 0) {
        for (var j = 0; j < queryRest.length; j++) {
          let taxprice = queryRest[j].taxprice;
          let productid = queryRest[j].vmaterialId;
          safestockmap.set(productid, taxprice);
        }
      }
      return safestockmap;
    }
    function generOtherInRecords(retailVouchDetails, needqty) {
      let othInRecords = {
        product: retailVouchDetails.product,
        productsku: retailVouchDetails.productsku,
        qty: needqty,
        unit: retailVouchDetails.unit,
        subQty: needqty,
        invExchRate: retailVouchDetails.invExchRate,
        stockUnitId: retailVouchDetails.stockUnitId,
        unitExchangeType: 0,
        _status: "Insert"
      };
      return othInRecords;
    }
  }
}
exports({ entryPoint: MyAPIHandler });