let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取销售订单主表标识
    let returnId = param.data[0].id;
    let agentId = param.data[0].agentId;
    let globeQueryStrLog = [];
    //获取前置订单应用token
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let tokenstr = tokenRes.access_token;
    //调用api操作，保证只有一个api才能保证同步更新
    var apiObject = [];
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
    var returnOrderObj = {};
    let returnOrderDetailStr = "";
    var returnDetailList = ObjectStore.queryByYonQL("select * from  voucher.salereturn.SaleReturnDetail  where saleReturnId = '" + returnId + "'", "udinghuo");
    globeQueryStrLog.push({ returnDetailList: "select * from  voucher.salereturn.SaleReturnDetail  where saleReturnId = '" + returnId + "'" });
    for (var prop = 0; prop < returnDetailList.length; prop++) {
      let saleOrderDetails = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + returnDetailList[prop]["firstsourceautoid"] + "", "udinghuo");
      globeQueryStrLog.push({ saleOrderDetails: "select * from voucher.order.OrderDetail where id = " + returnDetailList[prop]["firstsourceautoid"] + "" });
      let frontDetList = ObjectStore.queryByYonQL("select * from 	GT4691AT1.GT4691AT1.MFrontSaleOrderDet where id = " + saleOrderDetails[0]["sourceautoid"] + "", "developplatform");
      globeQueryStrLog.push({ frontDetList: "select * from 	GT4691AT1.GT4691AT1.MFrontSaleOrderDet where id = " + saleOrderDetails[0]["sourceautoid"] + "" });
      if (returnDetailList[prop]["firstsource"] == "voucher_order") {
        if (returnOrderObj[returnDetailList[prop]["firstsourceautoid"] + "-qty"] == undefined) {
          returnOrderObj[returnDetailList[prop]["firstsourceautoid"] + "-qty"] = 0;
        }
        if (returnOrderObj[returnDetailList[prop]["firstsourceautoid"] + "-money"] == undefined) {
          returnOrderObj[returnDetailList[prop]["firstsourceautoid"] + "-money"] = 0;
        }
        returnOrderObj[returnDetailList[prop]["firstsourceautoid"] + "-qty"] += returnDetailList[prop]["priceQty"]; //退货数量
        returnOrderObj[returnDetailList[prop]["firstsourceautoid"] + "-money"] += returnDetailList[prop]["priceQty"] * frontDetList[0]["fdOldPrice"];
        returnOrderDetailStr = replace(returnOrderDetailStr, returnDetailList[prop]["firstsourceautoid"] + ",", "");
        returnOrderDetailStr += returnDetailList[prop]["firstsourceautoid"] + ",";
      }
    }
    if (returnOrderDetailStr.length <= 0) {
      return;
    }
    returnOrderDetailStr = substring(returnOrderDetailStr, 0, returnOrderDetailStr.length - 1);
    let defineDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetailDefine where orderDetailId in (" + returnOrderDetailStr + ")", "udinghuo");
    console.log("select * from voucher.order.OrderDetailDefine where orderDetailId in (" + returnOrderDetailStr + ")");
    globeQueryStrLog.push({ defineDet: "select * from voucher.order.OrderDetailDefine where orderDetailId in (" + returnOrderDetailStr + ")" });
    for (let i = 0; i < defineDet.length; i++) {
      //返利赠品
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利赠品") {
        let insertRecords = [];
        let updateRecords = [];
        //根据自定义表detailId查询销售订单详情 取得关闭数量
        let orderProDet = ObjectStore.queryByYonQL("select *,productId.model from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        globeQueryStrLog.push({ orderProDet: "select *,productId.model from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "" });
        let lineCloseCount = returnOrderObj[defineDet[i]["orderDetailId"] + "-qty"]; //打开数量
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
            globeQueryStrLog.push({ rebateList: sql });
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
            if (updateRow.rpAftQuantity !== "") {
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
          let insertBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLog", op: "insert", opObj: insertRecords, domian: "developplatform", billno: "79f1f262" };
          apiObject.push(insertBatch);
          let updateBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLog", op: "update", opObj: updateRecords, domian: "developplatform", billno: "79f1f262" };
          apiObject.push(updateBatch);
        }
      }
      let dictFun = extrequire("GT4691AT1.publicfun.dictGetByCode");
      //返利金额
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利金额") {
        let insertRecords = [];
        let updateRecords = [];
        let orderProDet = ObjectStore.queryByYonQL("select *,productId.model from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        //查看前置订单子表id 以及已关闭数量
        let lineCloseCount = returnOrderObj[defineDet[i]["orderDetailId"] + "-money"];
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
            console.log(sql);
          }
          let deleteList = [];
          let updateList = [];
          for (let prop = 0; prop < rebateList.length; prop++) {
            let redNum = rebateList[i]["rpAftQuantity"] >= lineCloseCount ? lineCloseCount : rebateList[i]["rpAftQuantity"];
            if (redNum == 0) {
              continue;
            }
            //修改原记录
            rebateList[i]["rpAftQuantity"] = rebateList[i]["rpAftQuantity"] - redNum;
            let updateRow = {};
            updateRow.id = rebateList[i]["id"];
            updateRow.rpAftQuantity = rebateList[i]["rpAftQuantity"];
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
            let inRow = JSON.parse(JSON.stringify(rebateList[i]));
            inRow["rpQuantity"] = 0;
            inRow["rgExQuantity"] = redNum;
            inRow["rpAftQuantity"] = 0;
            inRow["rpId"] = orderProDet[0]["sourceid"];
            inRow["rpSourceBillCode"] = orderProDet[0]["upcode"];
            inRow["logSource"] = "前置订单";
            inRow["rpdDate"] = formatDate;
            inRow["rpPreQuantity"] = rebateList[i]["rpAftQuantity"];
            inRow["rpExMemo"] = rebateList[i]["code"];
            inRow["rpDetId"] = orderProDet[0]["sourceautoid"];
            inRow["rpParentId"] = rebateList[i]["id"];
            //记录前置订单单号
            insertRecords.push(inRow);
            if (lineCloseCount <= 0) {
              break;
            }
          }
          if (lineCloseCount > 0) {
            throw new Error("返利金额不足");
          }
          let insertBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLog", op: "insert", opObj: insertRecords, domian: "developplatform", billno: "7a529c02" };
          apiObject.push(insertBatch);
          let updateBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLog", op: "update", opObj: updateRecords, domian: "developplatform", billno: "7a529c02" };
          apiObject.push(updateBatch);
        }
      }
    }
    let apiResponse = postman("POST", "https://www.example.com/" + tokenstr + "", null, JSON.stringify({ apiObj: apiObject }));
    let apiObj = JSON.parse(apiResponse);
    if (apiObj.code != "200") {
      throw new Error(" - " + apiObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });