let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //更新测试
    let updateTestData = ObjectStore.queryByYonQL("select * from  GT4691AT1.GT4691AT1.MRebateProductsLog  where id = 'youridHere'", "developplatform");
    updateTestData[0]["rpExMemo"] = "wqy更新数据测试";
    //查询内容
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("GT4691AT1.GT4691AT1.MRebateProductsLog", object);
    throw new Error("更新成功！" + JSON.stringify(res));
    let insertBatch = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", updateTestData);
    if (insertBatch.length != insertRecords.length) {
      throw new Error("批量插入返利赠品记录异常，请联系管理员");
    }
    throw new Error("更新成功！");
    let orderId = request.saleId;
    let agentId = request.agentId;
    let lineId = request.lineId;
    function getDate(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
    let formatDate = getDate(new Date());
    let okRebateList = {};
    //根据id查询销售子表自定义项数据
    let defineDetSql = "select * from voucher.order.OrderDetailDefine where orderId = '" + orderId + "'";
    if (lineId != undefined && lineId != "" && lineId != {}) {
      defineDetSql += " and orderDetailId='" + lineId + "'";
    }
    let defineDet = ObjectStore.queryByYonQL(defineDetSql, "udinghuo");
    for (let i = 0; i < defineDet.length; i++) {
      //返利赠品
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利赠品") {
        let insertRecords = [];
        let updateRecords = [];
        //根据自定义表detailId查询销售订单详情 取得关闭数量
        let orderProDet = ObjectStore.queryByYonQL("select *,productId.model from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        let lineCloseCount = orderProDet[0]["closedRowCount"]; //打开数量
        //判断关闭数量是否大于0
        if (lineCloseCount != undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] != undefined) {
          //查询返利赠品兑换记录
          let rebateList = [];
          if (okRebateList[orderProDet[0]["productId"]] != undefined) {
            rebateList = okRebateList[orderProDet[0]["productId"]];
          } else {
            let sql =
              "select * from GT4691AT1.GT4691AT1.MRebateProductsLog  where rgCustomer='" +
              +agentId +
              "' and rpInv.model='" +
              orderProDet[0]["productId_model"] +
              "'  and rpAftQuantity>0 and rpInv = " +
              orderProDet[0]["productId"] +
              " and rpbInStock='是'  order by createTime asc";
            rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          }
          for (let prop = 0; prop < rebateList.length; prop++) {
            let redNum = rebateList[prop]["rpAftQuantity"] >= lineCloseCount ? lineCloseCount : rebateList[prop]["rpAftQuantity"];
            if (redNum == 0) {
              continue;
            }
            //修改原记录
            rebateList[prop]["rpAftQuantity"] = rebateList[prop]["rpAftQuantity"] - redNum;
            let updateRow = {};
            updateRow.id = rebateList[prop]["id"];
            updateRow.rpAftQuantity = rebateList[prop]["rpAftQuantity"];
            //判断是否已有更新行
            for (let j = 0; j < updateRecords.length; j++) {
              if (updateRecords[j]["id"] == updateRow.id) {
                updateRecords[j]["rpAftQuantity"] = updateRow.rpAftQuantity;
                updateRow.rpAftQuantity = "";
              }
            }
            if (updateRow.rpAftQuantity != "") {
              updateRecords.push(updateRow);
            }
            lineCloseCount = lineCloseCount - redNum;
            //插入一行记录
            let inRow = JSON.parse(JSON.stringify(rebateList[prop]));
            inRow["rpQuantity"] = 0;
            inRow["rgExQuantity"] = redNum;
            inRow["rpAftQuantity"] = 0;
            inRow["rpId"] = orderProDet[0]["sourceid"];
            inRow["rpSourceBillCode"] = orderProDet[0]["upcode"];
            inRow["logSource"] = "前置订单";
            inRow["rpdDate"] = formatDate;
            inRow["rpPreQuantity"] = rebateList[prop]["rpAftQuantity"];
            inRow["rpExMemo"] = rebateList[prop]["code"];
            inRow["rpDetId"] = orderProDet[0]["sourceautoid"];
            inRow["rpParentId"] = rebateList[prop]["id"];
            //记录前置订单单号
            insertRecords.push(inRow);
            if (lineCloseCount <= 0) {
              break;
            }
          }
          okRebateList[orderProDet[0]["productId"]] = rebateList;
          if (lineCloseCount > 0) {
            //库存不够
            throw new Error("返利赠品不足");
          }
          let insertBatch = ObjectStore.insertBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", insertRecords);
          if (insertBatch.length != insertRecords.length) {
            throw new Error("批量插入返利赠品记录异常，请联系管理员");
          }
          let updateBatch = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", updateRecords);
          if (updateBatch.length != updateRecords.length) {
            throw new Error("批量更新返利赠品记录异常，请联系管理员");
          }
        }
      }
      let dictFun = extrequire("GT4691AT1.publicfun.dictGetByCode");
      //返利金额
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利金额") {
        let insertRecords = [];
        let updateRecords = [];
        let orderProDet = ObjectStore.queryByYonQL("select *,productId.model from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        //查看前置订单子表id 以及已关闭数量
        let frontDetList = ObjectStore.queryByYonQL("select * from 	GT4691AT1.GT4691AT1.MFrontSaleOrderDet where id = " + orderProDet[0]["sourceautoid"] + "", "developplatform");
        let lineCloseCount = new Big(orderProDet[0]["closedRowCount"]).times(frontDetList[0]["fdOldPrice"]);
        if (lineCloseCount != undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] != undefined) {
          let rebateList = [];
          if (okRebateList[defineDet[i]["define11"] != undefined]) {
            rebateList = okRebateList[defineDet[i]["define11"]];
          } else {
            let sql =
              "select * from GT4691AT1.GT4691AT1.MRebateAmountLog where rgCustomer='" +
              agentId +
              "' and rpLegalEntity='" +
              dictFun.execute(null, { type: "eLegalEntity", code: orderProDet[0]["productId_model"] }) +
              "'  and rpAftQuantity>0 and MProductTag ='" +
              defineDet[i]["define11"] +
              "'   order by createTime asc";
            //标签-自定义项11
            rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          }
          let deleteList = [];
          let updateList = [];
          for (let prop = 0; prop < rebateList.length; prop++) {
            let redNum = rebateList[prop]["rpAftQuantity"] >= lineCloseCount ? lineCloseCount : rebateList[prop]["rpAftQuantity"];
            if (redNum == 0) {
              continue;
            }
            //修改原记录
            rebateList[prop]["rpAftQuantity"] = rebateList[prop]["rpAftQuantity"] - redNum;
            let updateRow = {};
            updateRow.id = rebateList[prop]["id"];
            updateRow.rpAftQuantity = rebateList[prop]["rpAftQuantity"];
            //判断是否已有更新行
            for (let j = 0; j < updateRecords.length; j++) {
              if (updateRecords[j]["id"] == updateRow.id) {
                updateRecords[j]["rpAftQuantity"] = updateRow.rpAftQuantity;
                updateRow.rpAftQuantity = "";
              }
            }
            if (updateRow.rpAftQuantity != "") {
              updateRecords.push(updateRow);
            }
            lineCloseCount = lineCloseCount - redNum;
            //插入一行记录
            let inRow = JSON.parse(JSON.stringify(rebateList[prop]));
            inRow["rpQuantity"] = 0;
            inRow["rgExQuantity"] = redNum;
            inRow["rpAftQuantity"] = 0;
            inRow["rpId"] = orderProDet[0]["sourceid"];
            inRow["rpSourceBillCode"] = orderProDet[0]["upcode"];
            inRow["logSource"] = "前置订单";
            inRow["rpdDate"] = formatDate;
            inRow["rpPreQuantity"] = rebateList[prop]["rpAftQuantity"];
            inRow["rpExMemo"] = rebateList[prop]["code"];
            inRow["rpDetId"] = orderProDet[0]["sourceautoid"];
            inRow["rpParentId"] = rebateList[prop]["id"];
            //记录前置订单单号
            insertRecords.push(inRow);
            if (lineCloseCount <= 0) {
              break;
            }
          }
          if (lineCloseCount > 0) {
            throw new Error(lineCloseCount + "返利金额不足");
          }
          let insertBatch = ObjectStore.insertBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", insertRecords);
          if (insertBatch.length != updateRecords.length) {
            throw new Error("批量插入返利金额记录异常，请联系管理员");
          }
          let updateBatch = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", updateRecords);
          if (updateBatch.length != updateRecords.length) {
            throw new Error("批量更新返利金额记录异常，请联系管理员");
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });