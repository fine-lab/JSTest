let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestData = request.data;
    if (requestData.resubmitCheckKey == null) {
      requestData.set("resubmitCheckKey", MD5Encode(uuid()));
    }
    let purInRecords = request.data.purInRecords;
    let sns = "";
    for (let i = 0; i < purInRecords.length; i++) {
      let purInRecordsSNs = purInRecords[i].purInRecordsSNs;
      if (purInRecordsSNs != null) {
        for (let j = 0; j < purInRecordsSNs.length; j++) {
          if (purInRecordsSNs[j].sn) {
            sns += "'" + purInRecordsSNs[j].sn + "',";
          }
        }
      }
    }
    if (sns.length > 0) {
      sns += sns.substring(0, sns.length - 1);
      //处理箱号箱数
      let arriavlsql = "select extendSn , extendBoxNumber , extendBoxCount from pu.arrivalorder.snMessage where extendSn in (" + sns + ")";
      let arriavlsnresult = ObjectStore.queryByYonQL(arriavlsql, "upu");
      for (let i = 0; i < purInRecords.length; i++) {
        let purInRecordsSNs = purInRecords[i].purInRecordsSNs;
        for (let j = 0; j < purInRecordsSNs.length; j++) {
          for (let k = 0; k < arriavlsnresult.length; k++) {
            if (purInRecordsSNs[j].sn && purInRecordsSNs[j].sn + "" == arriavlsnresult[k].extendSn + "") {
              purInRecordsSNs[j].extendBoxNo = arriavlsnresult[k].extendBoxNumber + "";
              purInRecordsSNs[j].extendBoxCount = arriavlsnresult[k].extendBoxCount;
            }
          }
        }
      }
    }
    //采购入库来源生单保存
    let url = "https://www.example.com/";
    let purInSaveApiResponse = openLinker("POST", url, "ST", JSON.stringify({ data: request.data }));
    let purInSaveApiResponseJson = JSON.parse(purInSaveApiResponse);
    if (purInSaveApiResponseJson.code != "200") {
      throw new Error(purInSaveApiResponseJson.message);
    }
    let purInData = purInSaveApiResponseJson.data.id;
    let purInIds = [];
    let map = {};
    map.id = purInData;
    purInIds.push(map);
    //自动审核
    let auditUrl = "https://www.example.com/";
    let auditApiResponse = openLinker("POST", auditUrl, "ST", JSON.stringify({ data: purInIds }));
    let auditApiResponseJson = JSON.parse(auditApiResponse);
    if (auditApiResponseJson.data.sucessCount == 0) {
      throw new Error(JSON.stringify(auditApiResponseJson.data.messages));
    }
    // 审核成功，回写囤货入库指令
    //销售订单主表id
    let sourceMainIdArray = [];
    let sourceMainIdMap = new Map();
    // 销售订单号
    let reviorArray = [];
    let reviorMap = new Map();
    //获取查询条件的集合
    let purInRecordDetail = purInSaveApiResponseJson.data.purInRecords;
    let sum = 0;
    for (let k = 0; k < purInRecordDetail.length; k++) {
      let sourceMainId = purInRecordDetail[k].poid;
      if (sourceMainId) {
        sourceMainIdArray.push(sourceMainId);
      }
      let subId = purInRecordDetail[k].podetailid;
      if (subId) {
        reviorArray.push(subId);
        sum += 1;
      }
    }
    let env = ObjectStore.env();
    let tenantid = env.tenantId;
    let batchResponse = "";
    if (sum > 0) {
      let batchUrl = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/generateBatchNum";
      batchResponse = openLinker("POST", batchUrl, "ST", JSON.stringify({ len: sum }));
      batchResponse = JSON.parse(batchResponse);
      if (batchResponse.code != "200") {
        throw new Error("获取批次号异常！请联系管理员！");
      }
    }
    //查询采购订单的来源
    let purchaseOrderSql = "select  id ,source from pu.purchaseorder.PurchaseOrder where id in ('" + sourceMainIdArray.join("','") + "')";
    let purchaseOrderRes = ObjectStore.queryByYonQL(purchaseOrderSql, "upu");
    if (!purchaseOrderRes || purchaseOrderRes.length == 0) {
      return {};
    }
    let sourceFlag = false;
    for (let j = 0; j < purchaseOrderRes.length; j++) {
      sourceMainIdMap.set(purchaseOrderRes[j].id, purchaseOrderRes[j].source);
    }
    //查询囤货入库指令
    let sourceSql = "select  id ,ReservoirInDetailList.id sid,ReservoirInDetailList.purchaseOrderDetailId purchaseOrderDetailId,ReservoirInDetailList.purInOrderDetailid purInOrderDetailid ";
    sourceSql += ",ReservoirInDetailList.resQuantity resQuantity ,ReservoirInDetailList.resOrderTime resOrderTime ,ReservoirInDetailList.esdDate esdDate ,ReservoirInDetailList.etaDate etaDate";
    sourceSql += " ,ReservoirInDetailList.resPoNumber resPoNumber ,ReservoirInDetailList.purchaseOrderDetailId purchaseOrderDetailId,  ReservoirInDetailList.inBillType  inBillType ";
    sourceSql += " from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn  where ReservoirInDetailList.purchaseOrderDetailId in ('" + reviorArray.join("','") + "')";
    let sourceRes = ObjectStore.queryByYonQL(sourceSql, "developplatform");
    if (!sourceRes || sourceRes.length == 0) {
      return {};
    }
    for (let j = 0; j < sourceRes.length; j++) {
      reviorMap.set(sourceRes[j].purchaseOrderDetailId, sourceRes[j]);
    }
    let srcBillNO = purInSaveApiResponseJson.data.srcBillNO;
    if (!srcBillNO) {
      throw new Error("到货单号为空");
    }
    let arrivalSql = "select vouchdate   from  pu.arrivalorder.ArrivalOrder  where code = '" + srcBillNO + "'";
    let arrivalRes = ObjectStore.queryByYonQL(arrivalSql, "upu");
    //发货日期
    let sendDate = !arrivalRes || arrivalRes.length == 0 ? "" : arrivalRes[0].vouchdate;
    //接口传输数据集合
    let result = [];
    let sendData = { inType: "2" };
    for (let z = 0; z < purInRecordDetail.length; z++) {
      let sourceMainId = purInRecordDetail[z].poid;
      if (!sourceMainId) {
        continue;
      }
      if (sourceMainIdMap.get(sourceMainId) != "developplatform.yba160dbe1") {
        continue;
      }
      let subId = purInRecordDetail[z].podetailid;
      let sourceData = reviorMap.get(subId);
      const obj = {};
      reviorMap.forEach((v, k) => (obj[k] = v));
      const JsonStr = JSON.stringify(obj);
      let reviorId = sourceData.sid;
      let detail = {};
      detail.mainId = sourceData.id;
      let purInId = sourceData.purInOrderDetailid;
      if (purInId && purInId != "") {
        //单据类型
        detail.billType = "3";
        //下单数量
        detail.resQuantity = sourceData.resQuantity;
        //下单时间
        detail.resOrderTime = sourceData.resOrderTime;
        //预计发送日期
        detail.esdDate = sourceData.esdDate;
        //预计到货日期
        detail.etaDate = sourceData.etaDate;
        detail.resPoNumber = sourceData.resPoNumber;
        //采购订单id
        detail.purchaseOrderDetailId = sourceData.purchaseOrderDetailId;
      } else {
        detail.action = "update";
      }
      if (purInId && purInId != "") {
        detail.action = "Insert";
      } else {
        detail.action = "Update";
      }
      detail.approveType = "Y";
      detail.id = reviorId;
      let lenCodeNum = batchResponse.data.codeNum;
      let codeStart = batchResponse.data.codeStart;
      let codeEnd = lenCodeNum + z;
      let codeEndStr = codeEnd + "";
      codeEndStr = prefixInteger(codeEnd, 4);
      detail.batchNumber = codeStart + codeEndStr;
      detail.batchQty = purInRecordDetail[z].qty;
      detail.ataDate = purInSaveApiResponseJson.data.vouchdate;
      detail.asdDate = sendDate;
      //囤货入库指令跟采购入库关联
      detail.purInOrderDetailid = purInRecordDetail[z].id;
      result.push(detail);
    }
    if (result.length > 0) {
      sendData.result = result;
      // 调接口回写数据
      let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updateInApi";
      let response = openLinker("POST", url, "ST", JSON.stringify({ data: sendData }));
      response = JSON.parse(response);
      if (response.code != "200") {
        throw new Error("同步囤货入库数量出错！请联系管理员！");
      }
    }
    return { message: "采购入库来源生单保存审核成功", id: auditApiResponseJson.data.infos.id };
  }
}
exports({ entryPoint: MyAPIHandler });