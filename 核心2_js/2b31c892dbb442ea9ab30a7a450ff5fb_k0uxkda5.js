let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pushdadaflag = pushData(param);
    return { pushdadaflag };
    function pushData(param) {
      let pushdataflag = false;
      let data = param.needpushdata;
      let store = data.store;
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
      if (productidmap.size > 0) {
        let productids = productidsstr.substring(0, productidsstr.length - 1);
        let salemap = queryaccmaterialOrgIDAndJSType1(productids);
        let availableqtymap = queryAvailableqty1(store, iWarehouseid, productids); //可用量
        let safestockmap1 = querySafeStock1(data, orgID, iWarehouseid, productids, "", errormessage);
        let productpricemap = getPriceByProductMap(productids);
        for (let key of productidmap.keys()) {
          let isConsignment = "代售结算商品" == salemap.get(key); //是否为代售结算商品
          if (isConsignment) {
            let availableqty = availableqtymap.get(key); //可用量
            //查询安全库存上下线
            let safestockmap = safestockmap1.get(key);
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
          saveOtherRecords(data, othInRecords, errormessage);
        }
        if (transferApplys.length > 0) {
          let wheresql = " and code like 'G'";
          let outwarehouse = querywarehouse("", stockorg, wheresql, errormessage);
          savetransferapplyRecords(data, stockorg, outwarehouse, iWarehouseid, transferApplys, errormessage);
          pushdataflag = savetransferapplyRecords1(data, stockorg, outwarehouse, iWarehouseid, transferApplys1, errormessage);
        }
      }
      return pushdataflag;
    }
    //从门店组织“旦高”将商品10010073调拨至供应商组织“路米”
    function savetransferapplyRecords1(requestData, stockOrgId, outwarehouse, inwarehouse, transferApplys, errormessage) {
      let param = extrequire("AT16560C6C08780007.rule.dateNow");
      let dateNow = param.execute();
      let voudate = dateNow.date;
      let bodys = {
        data: {
          outorg: requestData.salesOrg,
          outaccount: requestData.salesOrg,
          outwarehouse: inwarehouse,
          currency: "1555933670724337686",
          settlementAccount: requestData.salesOrg,
          vouchdate: voudate,
          outstore: requestData.store,
          bustype: "A03001",
          inorg: stockOrgId,
          inaccount: stockOrgId,
          inwarehouse: inwarehouse,
          _status: "Insert",
          transferApplys: transferApplys
        }
      };
      let paramurl = "/yonbip/scm/transferapply/save";
      let apiResponses = resopnseQuery(paramurl, bodys);
      return transauditBill(apiResponses, errormessage);
    }
    //门店拆单属性
    function queryChaidanValue(store) {
      let sql = "select * from 		aa.store.StoreCustomItem	where  id='" + store + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      var define1 = "";
      if (res.length > 0) {
        define1 = res[0].define1;
      }
      return define1;
    }
    //调拨订单保存
    function savetransferapplyRecords(requestData, stockOrgId, outwarehouse, inwarehouse, transferApplys, errormessage) {
      let param = extrequire("AT16560C6C08780007.rule.dateNow");
      let dateNow = param.execute();
      let voudate = dateNow.date;
      let bodys = {
        data: {
          outorg: stockOrgId,
          outaccount: stockOrgId,
          outwarehouse: outwarehouse,
          currency: "1555933670724337686",
          settlementAccount: stockOrgId,
          vouchdate: voudate,
          outstore: requestData.store,
          bustype: "A03001",
          inorg: requestData.salesOrg,
          inaccount: requestData.salesOrg,
          inwarehouse: inwarehouse,
          _status: "Insert",
          transferApplys: transferApplys
        }
      };
      let paramurl = "/yonbip/scm/transferapply/save";
      let apiResponses = resopnseQuery(paramurl, bodys);
      transauditBill(apiResponses, errormessage);
    }
    function transauditBill(singleSaveResponses, errormessage) {
      let singleSaveResult = JSON.parse(singleSaveResponses);
      let savedata = singleSaveResult.data;
      let flag = false;
      if (singleSaveResult.code == "200") {
        let aduitArray = new Array();
        let aduObj = { id: savedata.infos[0].id };
        aduitArray.push(aduObj);
        let aduitBody = {
          data: aduitArray
        };
        let paramurl = "/yonbip/scm/transferapply/batchaudit";
        let singleAduitResponses = resopnseQuery(paramurl, aduitBody);
        let singleAduitResult = JSON.parse(singleAduitResponses);
        if (singleAduitResult.code == "200") {
          let aduitfailCount = singleAduitResult.data.failCount;
          if (aduitfailCount > 0) {
            errormessage = errormessage + "调拨单审核异常:" + singleAduitResult.data.failInfos[0];
          } else {
            let transdata = savedata.infos[0];
            return generOuttrans(transdata);
          }
        }
      }
      return flag;
    }
    function generOuttrans(transdata) {
      let param = extrequire("AT16560C6C08780007.rule.dateNow");
      let dateNow = param.execute();
      let voudate = dateNow.date;
      let details = getdetails(transdata);
      let flag = false;
      let bodys = {
        data: {
          outorg: transdata.outorg,
          outaccount: transdata.outaccount,
          vouchdate: voudate,
          outStore: transdata.store,
          bustype: "A09001",
          bizType: 2,
          outwarehouse: transdata.outwarehouse,
          inStore: transdata.store,
          inorg: transdata.inorg,
          inStore_org: transdata.inorg,
          inwarehouse_org: transdata.inorg,
          inaccount: transdata.inaccount,
          settlementAccount: transdata.outorg,
          inwarehouse: transdata.inwarehouse,
          srcBill: transdata.id,
          srcBillNO: transdata.code,
          srcBillType: "st_transferapply",
          _status: "Insert",
          breturn: false,
          details: details
        }
      };
      let paramurl = "/yonbip/scm/storeout/save";
      let apiResponses = resopnseQuery(paramurl, bodys);
      let singleAduitResult = JSON.parse(apiResponses);
      if (singleAduitResult.code == "200") {
        let aduitfailCount = singleAduitResult.data.failCount;
        if (aduitfailCount == 0) {
          flag = true;
        }
      }
      return flag;
    }
    function getdetails(transdata) {
      let details = new Array();
      let transferApplys = transdata.transferApplys;
      for (let k = 0; k < transferApplys.length; k++) {
        let transferApply = transferApplys[k];
        let detail = {
          _status: "Insert",
          product: transferApply.product,
          contactsQuantity: transferApply.qty,
          contactsPieces: transferApply.qty,
          qty: transferApply.qty,
          unit: transferApply.unit,
          invExchRate: transferApply.invExchRate,
          subQty: transferApply.subQty,
          taxRate: transferApply.taxRate,
          stockUnitId: transferApply.stockUnitId,
          source: "st_transferapply",
          sourceid: transdata.id,
          sourceautoid: transferApply.id,
          firstsource: "st_transferapply",
          firstsourceid: transdata.id,
          firstsourceautoid: transferApply.id,
          firstupcode: transdata.code,
          upcode: transdata.code
        };
        details.push(detail);
      }
      return details;
    }
    function saveOtherRecords(requestData, othInRecords, errormessage) {
      //查询库存仓库
      let iWarehouseid_name = requestData.warehouse_name;
      let warehouse = querywarehouse(iWarehouseid_name, requestData.org, "", errormessage);
      let param = extrequire("AT16560C6C08780007.rule.dateNow");
      let dateNow = param.execute();
      let voudate = dateNow.date;
      let bodys = {
        data: {
          resubmitCheckKey: getResubmitCheckKey(),
          org: requestData.org,
          accountOrg: requestData.org,
          vouchdate: voudate,
          bustype: "A08010",
          store: requestData.store,
          warehouse: warehouse,
          _status: "Insert",
          othInRecords: othInRecords,
          defines: {
            define2: requestData.salesOrg,
            _status: "Insert"
          }
        }
      };
      let paramurl = "/yonbip/scm/othinrecord/single/save";
      let apiResponses = resopnseQuery(paramurl, bodys);
      //审核
      auditBill(apiResponses, errormessage);
    }
    function auditBill(singleSaveResponses, errormessage) {
      let singleSaveResult = JSON.parse(singleSaveResponses);
      let savedata = singleSaveResult.data;
      if (singleSaveResult.code == "200") {
        let aduitArray = new Array();
        let aduObj = { id: savedata.id };
        aduitArray.push(aduObj);
        let aduitBody = {
          data: aduitArray
        };
        let paramurl = "/yonbip/scm/othinrecord/batchaudit";
        let singleAduitResponses = resopnseQuery(paramurl, aduitBody);
        let singleAduitResult = JSON.parse(singleAduitResponses);
        if (singleAduitResult.code == "200") {
          let aduitfailCount = singleAduitResult.data.failCount;
          if (aduitfailCount > 0) {
            errormessage = "其他入库单审核异常:" + singleAduitResult.data.failInfos[0];
          }
        } else {
          errormessage = "其他入库单审核异常:" + singleAduitResult.message;
        }
      } else {
        errormessage = "其他入库单审核异常:" + singleSaveResult.message;
      }
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
      if (res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          var id = undefined != res[j].id ? res[j].id : "";
          var define4 = undefined != res[j].define4 ? res[j].define4 : "";
          productmap.set(id, define4);
        }
      }
      return productmap;
    }
    function queryaccmaterialOrgIDAndJSType(productID) {
      let productmap = new Map();
      let sql = "select * from 		pc.product.ProductFreeDefine	where  id='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      productmap.set("define4", "define4");
      if (res.length > 0) {
        var define4 = undefined != res[0].define4 ? res[0].define4 : "";
        productmap.set("define4", define4);
      }
      return productmap;
    }
    //可用量查询
    function queryAvailableqty(store, iWarehouseid, productID) {
      let sql = "select * from stock.currentstock.CurrentStock where  store='" + store + "'  and warehouse='" + iWarehouseid + "' and  product='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      let availableqty = 0;
      if (res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          availableqty = availableqty + res[j].currentqty;
        }
      }
      return availableqty;
    }
    function queryAvailableqty1(store, iWarehouseid, productID) {
      let sql = "select * from stock.currentstock.CurrentStock where  store='" + store + "'  and warehouse='" + iWarehouseid + "' and  product in(" + productID + ")";
      var res = ObjectStore.queryByYonQL(sql, "ustock");
      let safestockmap = new Map();
      if (res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          let product = res[j].product;
          if (safestockmap.hasOwnProperty(product)) {
            let availableqty = safestockmap.get(product);
            safestockmap.set(product, availableqty + res[j].currentqty);
          } else {
            safestockmap.set(product, res[j].currentqty);
          }
        }
      }
      return safestockmap;
    }
    //查询安全库存
    function querySafeStock(requestData, orgId, stockId, productID, product_cName, errormessage) {
      let sql = "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" + stockId + "' and wuliao = '" + productID + "' and org = '" + orgId + "'";
      let res = ObjectStore.queryByYonQL(sql, "developplatform");
      let safestockmap = new Map();
      let SX = 0;
      let XX = 0;
      if (res.length > 0) {
        //下限库存
        XX = res[0].xiaxiananquankucun;
        //上限库存
        SX = res[0].shangxiananquankucun;
      } else {
        errormessage = "【仓库】：" + requestData.warehouse_name + "【物料】：" + product_cName + "没有维护安全库存";
      }
      safestockmap.set("SX", SX);
      safestockmap.set("XX", XX);
      return safestockmap;
    }
    function querySafeStock1(requestData, orgId, stockId, productID, product_cName, errormessage) {
      let sql = "select * from 	AT16560C6C08780007.AT16560C6C08780007.aqkcbd where cangku = '" + stockId + "' and wuliao in(" + productID + ") and org = '" + orgId + "'";
      let res = ObjectStore.queryByYonQL(sql, "developplatform");
      let safestockmap = new Map();
      if (res.length > 0) {
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
    function getPriceByProductID(productID, nsupplierId) {
      let taxprice = 1; //
      let querysql = "select nprice taxprice  from aa.pricecenter.BiPriceEntity where enable=1 and vmaterialId='" + productID + "'  order by dbilldate desc";
      let queryRest = ObjectStore.queryByYonQL(querysql, "cpu-bi-service");
      if (queryRest.length > 0) {
        taxprice = queryRest[0].taxprice;
      }
      return taxprice;
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
    //幂等性
    function getResubmitCheckKey() {
      let uuids = uuid();
      let resubmitCheckKey = replace(uuids, "-", "");
      return resubmitCheckKey;
    }
    function gettoken() {
      let func1 = extrequire("AT16560C6C08780007.rule.getToken");
      let res = func1.execute(null);
      return res.access_token;
    }
    function getHttpurl() {
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let httpUrl = "https://www.example.com/";
      let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
      let httpResData = JSON.parse(httpRes);
      if (httpResData.code != "00000") {
        throw new Error("获取数据中心信息出错" + httpResData.message);
      }
      let httpurl = httpResData.data.gatewayUrl;
      return httpurl;
    }
    function resopnseQuery(paramurl, bodys) {
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let httpurl = getHttpurl();
      let token = gettoken();
      let url = httpurl + paramurl + "?access_token=" + token;
      let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(bodys));
      return apiResponseRes;
    }
    return { pushdadaflag };
  }
}
exports({ entryPoint: MyTrigger });