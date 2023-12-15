let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取销售订单主表标识
    let orderId = param.data[0].id;
    //获取前置订单应用token
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let tokenstr = tokenRes.access_token;
    //调用api操作，保证只有一个api才能保证同步更新
    var apiObject = [];
    var orderDetClose = param.data[0].orderDetails;
    let detIdStr = "";
    if (orderDetClose === undefined) {
      detIdStr = param.data[0]["orderDetailId"] + ",";
    } else {
      for (let prop = 0; prop < orderDetClose.length; prop++) {
        detIdStr += orderDetClose[prop]["id"] + ",";
      }
    }
    let defineSql = "select * from voucher.order.OrderDetailDefine where orderId = '" + orderId + "'";
    if (detIdStr.length > 0 && orderDetClose != undefined && orderDetClose.length === 1) {
      detIdStr = "" + substring(detIdStr, 0, detIdStr.length - 1) + "";
      defineSql += " and orderDetailId in (" + detIdStr + ")";
    }
    //根据id查询销售子表自定义项数据
    let defineDet = ObjectStore.queryByYonQL(defineSql, "udinghuo");
    for (let i = 0; i < defineDet.length; i++) {
      //返利赠品
      if (defineDet[i]["define9"] === "返利品" && defineDet[i]["define8"] === "返利赠品") {
        //根据自定义表detailId查询销售订单详情 取得关闭数量
        let orderProDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        let lineCloseCount = orderProDet[0]["closedRowCount"];
        //判断关闭数量是否大于0
        if (lineCloseCount !== undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] !== undefined) {
          //查询返利赠品兑换记录
          let sql = "select * from GT4691AT1.GT4691AT1.MRebateProductsLog where rpDetId = '" + orderProDet[0]["sourceautoid"] + "' order by createTime desc";
          let rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          let deleteList = [];
          let updateList = [];
          //对兑付记录进行核销
          for (let prop = 0; prop < rebateList.length; prop++) {
            let exQty = rebateList[prop]["rgExQuantity"];
            if (exQty !== undefined) {
              let thisQty = 0;
              if (exQty <= lineCloseCount) {
                rebateList[prop]["sourceAction"] = "销售订单行关闭";
                rebateList[prop]["oriCode"] = rebateList[prop].code;
                rebateList[prop]["oriCreateTime"] = rebateList[prop].createTime;
                rebateList[prop]["oriCreator"] = rebateList[prop].creator;
                deleteList.push(rebateList[prop]);
                thisQty = exQty;
              } else {
                rebateList[prop]["rgExQuantity"] = exQty - lineCloseCount;
                updateList.push(rebateList[prop]);
                thisQty = exQty - lineCloseCount;
              }
              lineCloseCount = lineCloseCount - thisQty;
              //找到对应的扣减数据行，将兑换数量还回去
              let parentListSql = "select * from GT4691AT1.GT4691AT1.MRebateProductsLog where id='" + rebateList[prop]["rpParentId"] + "'";
              let parentList = ObjectStore.queryByYonQL(parentListSql, "developplatform");
              if (parentList !== undefined && parentList.length > 0) {
                let aftQty = parentList[0]["rpAftQuantity"];
                parentList[0]["rpAftQuantity"] = aftQty + thisQty;
                //判断updateList中是否已存在此parent的更新
                for (let up = 0; up < updateList.length; up++) {
                  if (updateList[up]["id"] === parentList[0]["id"]) {
                    updateList[up]["rpAftQuantity"] = parseFloat(updateList[up]["rpAftQuantity"]) + thisQty;
                    parentList[0] = updateList[up]["rpAftQuantity"];
                  }
                }
                if (aftQty + thisQty === parentList[0]["rpAftQuantity"]) {
                  updateList.push(parentList[0]);
                }
              }
              if (lineCloseCount <= 0) {
                break;
              }
            }
          }
          if (deleteList.length > 0) {
            let insertBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLogDeleted", op: "insert", opObj: deleteList, domian: "developplatform" };
            apiObject.push(insertBatch);
            let deleteBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLog", op: "delete", opObj: deleteList, domian: "developplatform", billno: "79f1f262" };
            apiObject.push(deleteBatch);
          }
          if (updateList.length > 0) {
            let updateBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLog", op: "update", opObj: updateList, domian: "developplatform", billno: "79f1f262" };
            apiObject.push(updateBatch);
          }
        }
      }
      //返利金额
      if (defineDet[i]["define9"] === "返利品" && defineDet[i]["define8"] === "返利金额") {
        let orderProDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        //查看前置订单子表id 以及已关闭数量
        let frontDetList = ObjectStore.queryByYonQL("select * from 	GT4691AT1.GT4691AT1.MFrontSaleOrderDet where id = " + orderProDet[0]["sourceautoid"] + "", "developplatform");
        let lineCloseCount = new Big(orderProDet[0]["closedRowCount"]).times(frontDetList[0]["fdOldPrice"]);
        if (lineCloseCount !== undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] !== undefined) {
          let sql = "select * from GT4691AT1.GT4691AT1.MRebateAmountLog where rpDetId = '" + orderProDet[0]["sourceautoid"] + "' order by createTime desc";
          let rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          let deleteList = [];
          let updateList = [];
          for (let prop = 0; prop < rebateList.length; prop++) {
            let exQty = rebateList[prop]["rgExQuantity"];
            if (exQty !== undefined) {
              let thisQty = 0;
              if (exQty <= lineCloseCount) {
                rebateList[prop]["sourceAction"] = "销售订单行关闭";
                rebateList[prop]["oriCode"] = rebateList[prop].code;
                rebateList[prop]["oriCreateTime"] = rebateList[prop].createTime;
                rebateList[prop]["oriCreator"] = rebateList[prop].creator;
                deleteList.push(rebateList[prop]);
                thisQty = exQty;
              } else {
                rebateList[prop]["rgExQuantity"] = exQty - lineCloseCount;
                updateList.push(rebateList[prop]);
                thisQty = exQty - lineCloseCount;
              }
              lineCloseCount = lineCloseCount - thisQty;
              let parentList = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MRebateAmountLog where id=" + rebateList[prop]["rpParentId"] + "", "developplatform");
              if (parentList !== undefined && parentList.length > 0) {
                let aftQty = parentList[0]["rpAftQuantity"];
                parentList[0]["rpAftQuantity"] = aftQty + thisQty;
                for (let up = 0; up < updateList.length; up++) {
                  if (updateList[up]["id"] === parentList[0]["id"]) {
                    updateList[up]["rpAftQuantity"] = parseFloat(updateList[up]["rpAftQuantity"]) + thisQty;
                    parentList[0] = updateList[up]["rpAftQuantity"];
                  }
                }
                if (aftQty + thisQty === parentList[0]["rpAftQuantity"]) {
                  updateList.push(parentList[0]);
                }
              }
              if (lineCloseCount <= 0) {
                break;
              }
            }
          }
          if (deleteList.length > 0) {
            let insertBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLogDeleted", op: "insert", opObj: deleteList, domian: "developplatform" };
            apiObject.push(insertBatch);
            let deleteBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLog", op: "delete", opObj: deleteList, domian: "developplatform", billno: "7a529c02" };
            apiObject.push(deleteBatch);
          }
          if (updateList.length > 0) {
            let updateBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLog", op: "update", opObj: updateList, domian: "developplatform", billno: "7a529c02" };
            apiObject.push(updateBatch);
          }
        }
      }
    }
    if (apiObject.length <= 0) {
      return {};
    }
    let apiResponse = postman(
      "POST",
      "https://www.example.com/" + tokenstr + "",
      null,
      JSON.stringify({ apiObj: apiObject })
    );
    let apiObj = JSON.parse(apiResponse);
    if (apiObj.code !== "200") {
      throw new Error(" - " + apiObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });