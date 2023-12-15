let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let allpushdatadata = request.allpushdata;
    saveOtherRecords(allpushdatadata, "");
    savetransferapplyRecords(allpushdatadata, "");
    let pushdadaflag = savetransferapplyRecords1(allpushdatadata, "");
    return { pushdadaflag };
    function saveOtherRecords(allpushdatadata, errormessage) {
      let requestData = allpushdatadata.otherdata.data;
      let othInRecords = allpushdatadata.otherdata.othInRecords;
      let warehouse = allpushdatadata.otherdata.warehouse;
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
    function savetransferapplyRecords1(allpushdatadata, errormessage) {
      let requestData = allpushdatadata.transferapply1.data;
      let stockOrgId = allpushdatadata.transferapply1.stockorg;
      let outwarehouse = allpushdatadata.transferapply1.outwarehouse;
      let inwarehouse = allpushdatadata.transferapply1.iWarehouseid;
      let transferApplys = allpushdatadata.transferapply1.transferApplys1;
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
    //调拨订单保存
    function savetransferapplyRecords(allpushdatadata, errormessage) {
      let requestData = allpushdatadata.transferapply.data;
      let stockOrgId = allpushdatadata.transferapply.stockorg;
      let outwarehouse = allpushdatadata.transferapply.outwarehouse;
      let inwarehouse = allpushdatadata.transferapply.iWarehouseid;
      let transferApplys = allpushdatadata.transferapply.transferApplys;
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
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });