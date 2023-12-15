//正式
let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取退货订单主表标识
    let returnId = param.data[0].id;
    //获取前置订单应用token
    let func1 = extrequire("udinghuo.saleOrder.getFrontToken");
    let tokenRes = func1.execute(context, param);
    let tokenstr = tokenRes.access_token;
    //调用api操作，保证只有一个api才能保证同步更新
    var apiObject = [];
    var returnOrderObj = {};
    let returnOrderDetailStr = "";
    let returnDetailList = ObjectStore.queryByYonQL("select * from  voucher.salereturn.SaleReturnDetail  where saleReturnId = '" + returnId + "'", "udinghuo");
    for (var prop = 0; prop < returnDetailList.length; prop++) {
      let saleOrderDetails = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + returnDetailList[prop]["firstsourceautoid"] + "", "udinghuo");
      let frontDetList = ObjectStore.queryByYonQL("select * from 	GT4691AT1.GT4691AT1.MFrontSaleOrderDet where id = " + saleOrderDetails[0]["sourceautoid"] + "", "developplatform");
      if (returnDetailList[prop]["firstsource"] == "udinghuo.voucher_order") {
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
    //根据id查询销售子表自定义项数据
    let defineDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetailDefine where orderDetailId in (" + returnOrderDetailStr + ")", "udinghuo");
    for (let i = 0; i < defineDet.length; i++) {
      //返利赠品
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利赠品") {
        //根据自定义表detailId查询销售订单详情 取得关闭数量
        let orderProDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        let lineCloseCount = returnOrderObj[defineDet[i]["orderDetailId"] + "-qty"];
        //判断关闭数量是否大于0
        if (lineCloseCount != undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] != undefined) {
          //查询返利赠品兑换记录
          let sql = "select * from GT4691AT1.GT4691AT1.MRebateProductsLog where rpDetId = '" + orderProDet[0]["sourceautoid"] + "' order by createTime desc";
          let rebateList = ObjectStore.queryByYonQL(sql, "developplatform");
          let deleteList = [];
          let updateList = [];
          //对兑付记录进行核销
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
              //找到对应的扣减数据行，将兑换数量还回去
              let parentList = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MRebateProductsLog where id=" + rebateList[prop]["rpParentId"] + "", "developplatform");
              if (parentList != undefined && parentList.length > 0) {
                let aftQty = parentList[0]["rpAftQuantity"];
                parentList[0]["rpAftQuantity"] = aftQty + thisQty;
                //判断updateList中是否已存在此parent的更新
                for (let up = 0; up < updateList.length; up++) {
                  if (updateList[up]["id"] == parentList[0]["id"]) {
                    updateList[up]["rpAftQuantity"] = parseFloat(updateList[up]["rpAftQuantity"]) + thisQty;
                    parentList[0] = updateList[up]["rpAftQuantity"];
                  }
                }
                if (aftQty + thisQty == parentList[0]["rpAftQuantity"]) {
                  updateList.push(parentList[0]);
                }
              }
              if (lineCloseCount <= 0) {
                break;
              }
            }
          }
          let deleteBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLog", op: "delete", opObj: deleteList, domian: "developplatform" };
          apiObject.push(deleteBatch);
          let updateBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateProductsLog", op: "update", opObj: updateList, domian: "developplatform" };
          apiObject.push(updateBatch);
        }
      }
      //返利金额
      if (defineDet[i]["define9"] == "返利品" && defineDet[i]["define8"] == "返利金额") {
        let orderProDet = ObjectStore.queryByYonQL("select * from voucher.order.OrderDetail where id = " + defineDet[i]["orderDetailId"] + "", "udinghuo");
        //查看前置订单子表id 以及已关闭数量
        let lineCloseCount = returnOrderObj[defineDet[i]["orderDetailId"] + "-money"];
        if (lineCloseCount != undefined && lineCloseCount > 0 && orderProDet[0]["sourceautoid"] != undefined) {
          let sql = "select * from GT4691AT1.GT4691AT1.MRebateAmountLog where rpDetId = '" + orderProDet[0]["sourceautoid"] + "' order by createTime desc";
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
                for (let up = 0; up < updateList.length; up++) {
                  if (updateList[up]["id"] == parentList[0]["id"]) {
                    updateList[up]["rpAftQuantity"] = parseFloat(updateList[up]["rpAftQuantity"]) + thisQty;
                    parentList[0] = updateList[up]["rpAftQuantity"];
                  }
                }
                if (aftQty + thisQty == parentList[0]["rpAftQuantity"]) {
                  updateList.push(parentList[0]);
                }
              }
              if (lineCloseCount <= 0) {
                break;
              }
            }
          }
          let deleteBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLog", op: "delete", opObj: deleteList, domian: "developplatform" };
          apiObject.push(deleteBatch);
          let updateBatch = { entityUri: "GT4691AT1.GT4691AT1.MRebateAmountLog", op: "update", opObj: updateList, domian: "developplatform" };
          apiObject.push(updateBatch);
        }
      }
    }
    let apiResponse = postman("POST", "https://www.example.com/" + tokenstr + "", null, JSON.stringify({ apiObj: apiObject }));
    let apiObj = JSON.parse(apiResponse);
    if (apiObj.code != "200") {
      throw new Error(" - " + apiObj.message + "##returnOrderDetailStr:" + returnOrderDetailStr + "##");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });