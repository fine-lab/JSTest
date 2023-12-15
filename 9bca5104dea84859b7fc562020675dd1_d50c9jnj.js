let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let responseObj = { code: "200", message: "更新成功！" };
    if (!data) {
      responseObj = { code: "9991", message: "请检查入参！" };
      return responseObj;
    }
    // 批量更新数据
    let updateObjs = [];
    // 单据类型 1:采购订单,2:采购入库
    let inType = data.inType;
    let outboundMap = new Map(); //出库数量
    let result = data.result;
    for (let i = 0; i < result.length; i++) {
      let detail = {};
      let detailArray = [];
      let updateObj = {};
      //采购订单
      let billType = result[i].billType;
      //补货指令ID(taskDirectiveId)
      let taskDirectiveId = result[i].taskDirectiveId;
      //物料编码(resItemCode)
      let resItemCode = result[i].resItemCode;
      //指令类型(directiveType)
      let directiveType = result[i].directiveType;
      //入库指令ID(directiveId)
      let directiveId = result[i].directiveId;
      let resPoNumber = result[i].resPoNumber;
      //下单数量--数量
      let resQuantity = result[i].resQuantity;
      //下单时间--PO单据日期
      let resOrderTime = result[i].resOrderTime;
      //预计发送日期--采购订单计划到货日期（计划发货日期）
      let esdDate = result[i].esdDate;
      //预计到货日期--采购订单计划到货日期（计划发货日期）
      let etaDate = result[i].etaDate;
      //采购订单子表id
      let purchaseOrderDetailId = result[i].purchaseOrderDetailId;
      //采购入库子表id
      let purInOrderDetailid = result[i].purInOrderDetailid;
      detail.inBillType = billType;
      detail.resQuantity = resQuantity;
      detail.resOrderTime = resOrderTime;
      detail.esdDate = esdDate;
      detail.etaDate = etaDate;
      detail.resPoNumber = resPoNumber;
      detail.purchaseOrderDetailId = purchaseOrderDetailId;
      detail.purInOrderDetailid = purInOrderDetailid;
      if (inType == "1") {
        //查询数据库数据
        updateObj.id = result[i].mainId;
        //如果是采购订单-审批通过，则插入数据
        if (result[i].approveType && result[i].approveType == "Y") {
          detail._status = "Insert";
          detail.dataStatus = "2";
        } else if (result[i].approveType && result[i].approveType == "R") {
          //撤回-删除数据
          let sql = "select id,ReservoirInDetailList.id as subId  from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn ";
          if (result[i].mainId) {
            sql += " where id = '" + result[i].mainId + "' ";
          }
          let res = ObjectStore.queryByYonQL(sql);
          detail.id = res[0].subId;
          detail._status = "Delete";
        }
      } else {
        let action = result[i].action;
        if (result[i].approveType && result[i].approveType == "Y") {
          //如果是采购入库，则更新数据
          detail.batchNumber = result[i].batchNumber;
          detail.batchQty = result[i].batchQty;
          detail.ataDate = result[i].ataDate;
          detail.asdDate = result[i].asdDate;
        } else {
          detail.batchNumber = "";
          detail.batchQty = "";
          detail.ataDate = "";
          detail.asdDate = "";
        }
        updateObj.id = result[i].mainId;
        detail.id = result[i].id;
        detail._status = action;
      }
      //组装聚合vo
      detailArray.push(detail);
      updateObj.ReservoirInDetailList = detailArray;
      updateObjs.push(updateObj);
    }
    if (updateObjs.length == 0) {
      return responseObj;
    }
    var res1 = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", updateObjs, "yba160dbe1");
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });