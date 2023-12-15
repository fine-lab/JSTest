let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let responseObj = { code: "200", message: "更新成功！" };
    if (!data) {
      responseObj = { code: "999", message: "请检查入参！" };
      return responseObj;
    }
    let updateObjs = []; // 批量更新数据
    let outType = data.outType; // 单据类型 1:销售订单,2:销售出库,3:退货入库
    let outboundMap = new Map(); // 出库数量
    let orderCountMap = new Map(); // 退货入库处理销售订单占用数量
    let leftCountMap = new Map(); // 退货入库处理剩余关联数量
    let result = data.result;
    for (let i = 0; i < result.length; i++) {
      let flag = result[i].extendOutId; // 出入库指令任务ID@_@出库指令ID@_@批次号
      let itemId = result[i].extendOutItem; // 物料id
      let qty = result[i].outCount; // 物料数量
      let outCode = result[i].outCode; // 单据编码
      let outDate = result[i].outDate; // 单据日期=出库时间
      let reg = new RegExp("^[0-9]+$");
      if (reg.test(outDate)) {
        let datePar = new Date(parseInt(outDate));
        outDate = datePar.getFullYear() + "-" + prefixInteger(datePar.getMonth() + 1, 2) + "-" + prefixInteger(datePar.getDate(), 2);
      }
      let flagSplit = flag.split("@_@");
      let sql =
        "select id,leftOutCount,orderCount,outboundQty,(select * from ReservoirOutDetailList) as ReservoirOutDetailList,(select * from OrderDetailsDetailList) as OrderDetailsDetailList from AT181E613C1770000A.AT181E613C1770000A.ReservoirOut ";
      sql += " where taskDirectiveId = '" + flagSplit[0] + "' ";
      sql += " and directiveId = '" + flagSplit[1] + "' ";
      if (flagSplit[2]) {
        // 批次号不为空
        sql += " and batchNumber = '" + flagSplit[2] + "' ";
      }
      let res = ObjectStore.queryByYonQL(sql);
      if (!res || res.length == 0) {
        responseObj = { code: "999", message: "未查询到对应囤货出库数据，请检查！" };
        return responseObj;
      }
      for (let j = 0; j < res.length; j++) {
        let updateObj = {};
        updateObj.id = res[j].id;
        let orderUpdate = {};
        // 查找是否已经存在当前单据，若存在则更新，否则插入
        let reservoirOutDetail = {};
        let status = "Insert"; // 默认插入
        if (res[j].ReservoirOutDetailList && res[j].ReservoirOutDetailList.length > 0 && outType != "1") {
          let reservoirOutDetailList = res[j].ReservoirOutDetailList;
          for (let z = 0; z < reservoirOutDetailList.length; z++) {
            let item = reservoirOutDetailList[z];
            if (item.outCode == outCode && item.outType == outType) {
              // 已记录锅当前单据
              reservoirOutDetail = Object.assign({}, item);
            }
          }
        }
        if (res[j].OrderDetailsDetailList && res[j].OrderDetailsDetailList.length > 0 && outType == "1") {
          let orderDetailsDetailList = res[j].OrderDetailsDetailList;
          for (let k = 0; k < orderDetailsDetailList.length; k++) {
            let item = orderDetailsDetailList[k];
            if (item.outCode == outCode && item.outType == outType) {
              // 已记录锅当前单据
              reservoirOutDetail = Object.assign({}, item);
            }
          }
        }
        if (outType == "1") {
          // 销售订单回写数据
          if (!res[j].orderCount) {
            res[j].orderCount = 0;
          }
          if (reservoirOutDetail.outOrderCount) {
            if (result[i].isDelete != "Y") {
              qty = Number(qty) - Number(reservoirOutDetail.outOrderCount);
              reservoirOutDetail._status = "Update";
              reservoirOutDetail.outOrderCount = Number(reservoirOutDetail.outOrderCount) + qty;
              reservoirOutDetail.outDate = outDate;
            } else {
              let id = reservoirOutDetail.id;
              reservoirOutDetail = {};
              reservoirOutDetail.id = id;
              reservoirOutDetail._status = "Delete";
            }
          } else {
            reservoirOutDetail.outOrderCount = Number(qty);
          }
          // 销售订单所用物料数量
          updateObj.orderCount = Number(res[j].orderCount) + Number(qty);
          // 剩余未关联的物料数量
          updateObj.leftOutCount = Number(res[j].leftOutCount) - Number(qty);
          qty = 0;
          if (reservoirOutDetail.id) {
            // 已存在
            updateObj.OrderDetailsDetailList = [reservoirOutDetail];
          } else {
            //新增
            reservoirOutDetail.outType = outType;
            reservoirOutDetail.outCode = outCode;
            reservoirOutDetail.outCount = qty;
            reservoirOutDetail.outDate = outDate;
            reservoirOutDetail.dataStatus = "1";
            reservoirOutDetail._status = "Insert";
            updateObj.OrderDetailsDetailList = [reservoirOutDetail];
          }
        } else {
          // 销售出库、退货入库
          // 出库数量
          if (!res[j].outboundQty) {
            res[j].outboundQty = 0;
          }
          if (reservoirOutDetail.outCount) {
            if (result[i].isDelete != "Y") {
              qty = Number(qty) - Number(reservoirOutDetail.outCount);
              reservoirOutDetail._status = "Update";
              reservoirOutDetail.outCount = Number(reservoirOutDetail.outCount) + qty;
              reservoirOutDetail.outDate = outDate;
            } else {
              let id = reservoirOutDetail.id;
              reservoirOutDetail = {};
              reservoirOutDetail.id = id;
              reservoirOutDetail._status = "Delete";
            }
          }
          if (outboundMap.has(res[j].id)) {
            // 出库数量已被修改过，应用修改后的出库数量
            let dd = outboundMap.get(res[j].id);
            updateObj.outboundQty = outboundMap.get(res[j].id) + Number(qty);
            outboundMap.set(res[j].id, updateObj.outboundQty);
          } else {
            updateObj.outboundQty = Number(res[j].outboundQty) + Number(qty);
            outboundMap.set(res[j].id, updateObj.outboundQty);
          }
          // 退货入库，需处理销售订单占用数量、剩余未关联数量
          if (outType == "3") {
            if (orderCountMap.has(res[j].id)) {
              updateObj.orderCount = orderCountMap.get(res[j].id) + Number(result[i].outCount);
              orderCountMap.set(res[j].id, updateObj.orderCount);
              updateObj.leftOutCount = leftCountMap.get(res[j].id) - Number(result[i].outCount);
              leftCountMap.set(res[j].id, updateObj.leftOutCount);
            } else {
              updateObj.orderCount = Number(res[j].orderCount) + Number(result[i].outCount);
              orderCountMap.set(res[j].id, updateObj.orderCount);
              updateObj.leftOutCount = Number(res[j].leftOutCount) - Number(result[i].outCount);
              leftCountMap.set(res[j].id, updateObj.leftOutCount);
            }
          }
          if (reservoirOutDetail.id) {
            // 已存在
            updateObj.ReservoirOutDetailList = [reservoirOutDetail];
          } else {
            //新增
            reservoirOutDetail.outType = outType;
            reservoirOutDetail.outCode = outCode;
            reservoirOutDetail.outCount = qty;
            reservoirOutDetail.outDate = outDate;
            reservoirOutDetail.dataStatus = "1";
            reservoirOutDetail._status = "Insert";
            updateObj.ReservoirOutDetailList = [reservoirOutDetail];
          }
        }
        updateObjs.push(updateObj);
      }
    }
    if (updateObjs.length == 0) {
      return responseObj;
    }
    let updateRes = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirOut", updateObjs, "yb97e9b3a5");
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });