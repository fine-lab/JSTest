let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orderId = request.saleId;
    //根据id查询子表数据
    let defineDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetailDefine where orderId = '" + orderId + "'", "udinghuo");
    for (let i = 0; i < defineDet.length; i++) {
      //返利赠品
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利赠品") {
        let orderProDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        //查看前置订单子表id 以及已关闭数量
        let lineCloseCount = orderProDet[0]["closedRowCount"];
        throw new Error(lineCloseCount);
        if (lineCloseCount != undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] != undefined) {
          let sql = "select * from GT4691AT1.GT4691AT1.MRebateProductsLog where rpDetId = '" + orderProDet[0]["sourceautoid"] + "'";
          let rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          let deleteList = [];
          let updateList = [];
          for (let prop = 0; prop < rebateList.length; prop++) {
            let exQty = rebateList[prop]["rgExQuantity"];
            if (exQty != undefined) {
              let thisQty = 0;
              if (exQty <= lineCloseCount) {
                deleteList.push(rebateList[prop]);
                thisQty = exQty;
              } else {
                rebateList[prop]["rgExQuantity"] = exQty - lineCloseCount;
                updateList.push(rebateList[prop]);
                thisQty = exQty - lineCloseCount;
              }
              lineCloseCount = lineCloseCount - thisQty;
              let parentList = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MRebateProductsLog where id=" + rebateList[prop]["rpParentId"] + "", "", "developplatform");
              if (parentList != undefined && parentList.length > 0) {
                let aftQty = parentList[0]["rpAftQuantity"];
                parentList[0]["rpAftQuantity"] = aftQty + thisQty;
                updateList.push(parentList[0]);
              }
              if (lineCloseCount <= 0) {
                break;
              }
            }
          }
          //删除记录
          let deleteBatch = ObjectStore.deleteBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", deleteList, "", "developplatform");
          if (deleteList.length > 0 && deleteList.length != deleteBatch.length) {
            throw new Error("关闭失败：删除已有返利赠品记录发生异常");
          }
          //更新记录
          let updateBatch = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", updateList, "", "developplatform");
          if (updateList.length == 0 || updateBatch.length != updateList.length) {
            throw new Error("关闭失败：返还返利赠品发生异常");
          }
        }
      }
      //返利金额
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利金额") {
        let orderProDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        //查看前置订单子表id 以及已关闭数量
        let lineCloseCount = orderProDet[0]["closedSumMoney"];
        if (lineCloseCount != undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] != undefined) {
          let sql = "select * from GT4691AT1.GT4691AT1.MRebateAmountLog where rpDetId = '" + orderProDet[0]["sourceautoid"] + "'";
          let rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          let deleteList = [];
          let updateList = [];
          for (let prop = 0; prop < rebateList.length; prop++) {
            let exQty = rebateList[prop]["rgExQuantity"];
            if (exQty != undefined) {
              let thisQty = 0;
              if (exQty <= lineCloseCount) {
                deleteList.push(rebateList[prop]);
                thisQty = exQty;
              } else {
                rebateList[prop]["rgExQuantity"] = exQty - lineCloseCount;
                updateList.push(rebateList[prop]);
                thisQty = exQty - lineCloseCount;
              }
              lineCloseCount = lineCloseCount - thisQty;
              let parentList = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MRebateAmountLog where id=" + rebateList[prop]["rpParentId"] + "", "developplatform");
              if (parentList != undefined && parentList.length > 0) {
                let aftQty = parentList[0]["rpAftQuantity"];
                parentList[0]["rpAftQuantity"] = aftQty + thisQty;
                updateList.push(parentList[0]);
              }
              if (lineCloseCount <= 0) {
                break;
              }
            }
          }
          //删除记录
          let deleteBatch = ObjectStore.deleteBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", deleteList, "", "developplatform");
          if (deleteList.length > 0 && deleteList.length != deleteBatch.length) {
            throw new Error("关闭失败：删除已有返利金额记录发生异常");
          }
          //更新记录
          let updateBatch = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", updateList, "", "developplatform");
          if (updateList.length == 0 || updateBatch.length != updateList.length) {
            throw new Error("关闭失败：返还返利金额发生异常");
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });