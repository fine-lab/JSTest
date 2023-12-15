let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.data[0];
    let retailVouchDetails = requestData.retailVouchDetails;
    let store = requestData.store; //门店
    let orgID = requestData.iOrgid; //销售组织
    let errormessage = "";
    let stockOrgmap = new Map();
    if (undefined != store && "1597466579984973833" == store) {
      for (let k = 0; k < requestData.retailVouchDetails.length; k++) {
        let productID = requestData.retailVouchDetails[k].product; //商品id
        let iWarehouseid = requestData.retailVouchDetails[k].iWarehouseid; //仓库ID
        if (iWarehouseid == undefined || iWarehouseid == "") {
          continue;
        } else {
          let stockOrgId = queryaccmaterialOrgIDAndJSType(productID).get("define1"); //商品库存组织
          stockOrgmap.set(iWarehouseid, stockOrgId);
        }
      }
    }
    if (stockOrgmap.size != 0) {
      for (let key of stockOrgmap.keys()) {
        let othInRecords = new Array();
        let transferApplys = new Array();
        for (let i = 0; i < requestData.retailVouchDetails.length; i++) {
          let retailVouchDetail = requestData.retailVouchDetails[i];
          let iWarehouseid = retailVouchDetail.iWarehouseid; //仓库id
          if (iWarehouseid == key) {
            let productID = retailVouchDetail.product; //商品id
            let isConsignment = "代售结算商品" == queryaccmaterialOrgIDAndJSType(productID).get("define4"); //是否为代售结算商品
            if (isConsignment) {
              let availableqty = queryAvailableqty(store, iWarehouseid, productID); //可用量
              //查询安全库存上下线
              let safestockmap = querySafeStock(requestData, orgID, iWarehouseid, productID, errormessage);
              if (retailVouchDetail.fQuantity > availableqty - safestockmap.get("XX")) {
                //需要调拨数量
                let needqty = retailVouchDetail.fQuantity + safestockmap.get("SX") - availableqty;
                let transferApply = genertransferApplys(retailVouchDetail, needqty);
                transferApplys.push(transferApply);
                let otherinrecord = generOtherInRecords(retailVouchDetail, needqty);
                othInRecords.push(otherinrecord);
              }
            }
          }
        }
        if (transferApplys.length > 0) {
          let wheresql = " and code like 'G'";
          let outwarehouse = querywarehouse("", stockOrgmap.get(key), wheresql, errormessage);
          savetransferapplyRecords(requestData, stockOrgmap.get(key), outwarehouse, key, transferApplys, errormessage);
        }
        if (othInRecords.length > 0) {
          saveOtherRecords(requestData, othInRecords, errormessage);
        }
      }
    }
    //调拨订单保存
    function savetransferapplyRecords(requestData, stockOrgId, outwarehouse, inwarehouse, transferApplys, errormessage) {
      let url = "https://www.example.com/";
      let param = extrequire("RM.rule.dateNow");
      let dateNow = param.execute();
      let voudate = dateNow.date;
      let bodys = {
        data: {
          outorg: stockOrgId,
          outaccount: stockOrgId,
          outwarehouse: outwarehouse,
          vouchdate: voudate,
          bustype: "A03001",
          inorg: requestData.iOrgid,
          inaccount: requestData.iOrgid,
          inwarehouse: inwarehouse,
          _status: "Insert",
          transferApplys: transferApplys
        }
      };
      let paramurl = "/yonbip/scm/transferapply/save";
      let apiResponses = resopnseQuery(paramurl, bodys);
      let transSaveResult = JSON.parse(apiResponses);
      if (transSaveResult.code !== "200") {
        errormessage = "调拨单保存异常:" + transSaveResult.message;
      }
    }
    //生成其他入库单
    function saveOtherRecords(requestData, othInRecords, errormessage) {
      //查询库存仓库
      let iWarehouseid_name = requestData.iWarehouseid_name;
      let warehouse = querywarehouse(iWarehouseid_name, requestData.iOrgid, "", errormessage);
      let url = "https://www.example.com/";
      let param = extrequire("RM.rule.dateNow");
      let dateNow = param.execute();
      let voudate = dateNow.date;
      let bodys = {
        data: {
          resubmitCheckKey: getResubmitCheckKey(),
          org: requestData.iOrgid,
          accountOrg: requestData.iOrgid,
          vouchdate: voudate,
          bustype: "A08001",
          store: requestData.store,
          warehouse: warehouse,
          department: requestData.iDepartmentid,
          _status: "Insert",
          othInRecords: othInRecords,
          defines: {
            define2: requestData.iOrgid,
            define1: requestData.code,
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
    //判断商品标签是否为代售结算商品
    function judgeProductIsConsignment(productID) {
      let sql = "select * from pc.product.ProductTagNew where productId='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      let name = "";
      if (res.length > 0) {
        let tagid = res[0].tagId;
        sql = "select * from pc.tag.Tag where id='" + tagid + "'";
        res = ObjectStore.queryByYonQL(sql, "productcenter");
        if (res.length > 0) {
          name = res[0].name;
        }
      }
      return "代售结算商品" == name ? true : false;
    }
    //查询安全库存
    function querySafeStock(requestData, orgId, stockId, productID, errormessage) {
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
        errormessage = "【仓库】：" + requestData.iWarehouseid_name + "【物料】：" + requestData.product_cName + "没有维护安全库存";
      }
      safestockmap.set("SX", SX);
      safestockmap.set("XX", XX);
      return safestockmap;
    }
    function genertransferApplys(retailVouchDetails, needqty) {
      let transferApplys = {
        product: retailVouchDetails.product,
        qty: needqty,
        subQty: retailVouchDetails.fmainUnitQuantity,
        invExchRate: retailVouchDetails.offlineRate,
        _status: "Insert"
      };
      return transferApplys;
    }
    function generOtherInRecords(retailVouchDetails, needqty) {
      let othInRecords = {
        product: retailVouchDetails.product,
        productsku: retailVouchDetails.productsku,
        qty: needqty,
        unit: retailVouchDetails.mainUnitid,
        subQty: retailVouchDetails.fmainUnitQuantity,
        invExchRate: retailVouchDetails.offlineRate,
        stockUnitId: retailVouchDetails.mainUnitid,
        unitExchangeType: 0,
        _status: "Insert"
      };
      return othInRecords;
    }
    //查询物料库存组织
    function queryaccmaterialOrgID(productID) {
      let sql = "select * from 		pc.product.ProductFreeDefine	where  id='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var define1 = "";
      if (res.length > 0) {
        define1 = res[0].define1;
      }
      return define1;
    }
    function queryaccmaterialOrgIDAndJSType(productID) {
      let productmap = new Map();
      let sql = "select * from 		pc.product.ProductFreeDefine	where  id='" + productID + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      productmap.set("define1", "define1");
      productmap.set("define4", "define4");
      if (res.length > 0) {
        var define1 = undefined != res[0].define1 ? res[0].define1 : "";
        productmap.set("define1", define1);
        var define4 = undefined != res[0].define4 ? res[0].define4 : "";
        productmap.set("define4", define4);
      }
      return productmap;
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
    //幂等性
    function getResubmitCheckKey() {
      let uuids = uuid();
      let resubmitCheckKey = replace(uuids, "-", "");
      return resubmitCheckKey;
    }
    function gettoken() {
      let func1 = extrequire("RM.rule.getToken");
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
    return { errormessage };
  }
}
exports({ entryPoint: MyTrigger });