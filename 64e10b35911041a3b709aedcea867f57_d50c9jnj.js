let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let action = param.action;
    let code = data[0].code;
    let outSql =
      "select code,vouchdate ,purInRecords.podetailid	podetailid, purInRecords.poid poid,	purInRecords.qty qty, purInRecords.extendReceiptBatchNo batchno,srcBillNO ,purInRecords.id detailId from st.purinrecord.PurInRecord ";
    outSql += " where code = '" + code + "' ";
    let outRes = ObjectStore.queryByYonQL(outSql);
    if (!outRes || outRes.length == 0) {
      return {};
    }
    //销售订单主表id
    let sourceMainIdArray = [];
    let sourceMainIdMap = new Map();
    // 销售订单号
    let reviorArray = [];
    let reviorMap = new Map();
    //获取查询条件的集合
    for (let i = 0; i < outRes.length; i++) {
      let sourceMainId = outRes[i].poid;
      if (sourceMainId) {
        sourceMainIdArray.push(sourceMainId);
      }
      let subId = outRes[i].podetailid;
      if (subId) {
        reviorArray.push(subId);
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
    //接口传输数据集合
    let result = [];
    let sendData = { inType: "2" };
    for (let i = 0; i < outRes.length; i++) {
      let sourceMainId = outRes[i].poid;
      if (!sourceMainId) {
        continue;
      }
      if (sourceMainIdMap.get(sourceMainId) != "developplatform.yba160dbe1") {
        continue;
      }
      let srcBillNO = outRes[0].srcBillNO;
      if (!srcBillNO) {
        throw new Error("到货单号为空");
      }
      let arrivalSql = "select vouchdate   from  pu.arrivalorder.ArrivalOrder  where code = '" + srcBillNO + "'";
      let arrivalRes = ObjectStore.queryByYonQL(arrivalSql, "upu");
      //发货日期
      let sendDate = !arrivalRes || arrivalRes.length == 0 ? "" : arrivalRes[0].vouchdate;
      let subId = outRes[i].podetailid;
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
      if (action == "audit") {
        if (purInId && purInId != "") {
          detail.action = "Insert";
        } else {
          detail.action = "Update";
        }
        detail.approveType = "Y";
      } else {
        if (sourceData.inBillType == "3") {
          detail.action = "Delete";
        } else {
          detail.action = "Update";
        }
        detail.approveType = "R";
      }
      detail.id = reviorId;
      detail.batchNumber = outRes[i].batchno;
      detail.batchQty = outRes[i].qty;
      detail.ataDate = outRes[i].vouchdate;
      detail.asdDate = sendDate;
      //囤货入库指令跟采购入库关联
      detail.purInOrderDetailid = outRes[i].detailId;
      result.push(detail);
    }
    if (result.length > 0) {
      sendData.result = result;
      // 调接口回写数据
      let env = ObjectStore.env();
      let tenantid = env.tenantId;
      let url = "https://www.example.com/" + tenantid + "/product_ref/product_ref_01/updateInApi";
      let response = openLinker("POST", url, "ST", JSON.stringify({ data: sendData }));
      response = JSON.parse(response);
      if (response.code != "200") {
        throw new Error("同步囤货入库数量出错！请联系管理员！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });