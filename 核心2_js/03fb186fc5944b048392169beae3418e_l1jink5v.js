let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let mainObj = param.data[0];
    let actionSource = context.billnum;
    let actionName = context.action.toLowerCase();
    let debuginfo = { mainObj: mainObj, context: context };
    if (mainObj.fdOrderSource === "经销商") {
      if (["a497e816", "a497e816List"].indexOf(actionSource) >= 0 && actionName.indexOf("submit") >= 0) {
        return {};
      }
    }
    {
      let mainRes = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MFrontSaleOrderMain where id ='" + mainObj.id + "'");
      if (mainRes.length > 0) {
        mainObj = mainRes[0];
      }
      let detList = ObjectStore.queryByYonQL('select *,MProductTag.code as MProductTag_code from GT4691AT1.GT4691AT1.MFrontSaleOrderDet where MFrontSaleOrderDetFk.id = "' + mainObj.id + '"'); //mainObj["MFrontSaleOrderDetList"];
      //客户、法律实体、涉及物料
      //取出返利金额
      let message;
      let rebateObj = {};
      let invStr = "";
      for (let prop = 0; prop < detList.length; prop++) {
        if (detList[prop].fdInvType == "返利品" && detList[prop].fdProMemo == "返利金额") {
          detList[prop]["useQty"] = 0;
          detList[prop]["stockQty"] = 0;
          detList[prop]["fdMainAmount"] = detList[prop].fdQuantity * detList[prop].fdOldPrice;
          let itemName = detList[prop]["MProductTag_code"] + "&" + detList[prop]["fdBU"];
          if (rebateObj[itemName] == undefined) {
            rebateObj[itemName] = { fdMainQty: 0, rowId: detList[prop]["id"], useQty: 0, fdRebateUid: "", stockQty: 0 };
            invStr += detList[prop]["MProductTag"] + ",";
          }
          rebateObj[itemName]["fdMainQty"] += detList[prop].fdQuantity * detList[prop].fdOldPrice;
        }
      }
      //没有返利金额
      if (Object.keys(rebateObj).length <= 0) {
        return {};
      }
      invStr = invStr.substring(0, invStr.length - 1);
      //判断库存是否富裕
      let sql =
        "select  MProductTag,MProductTag.code as MProductTag_code,MProductTag.ptagname as MProductTag_name,sum(rpAftQuantity) as qty,rpBU  from GT4691AT1.GT4691AT1.MRebateAmountLog where rgCustomer='" +
        +mainObj.fmCustomer +
        "' and rpLegalEntity='" +
        mainObj.fmLegalEntity +
        "'  and rpAftQuantity>0 and MProductTag in (" +
        invStr +
        ")   group by  MProductTag,MProductTag.code,MProductTag.ptagname,rpBU ";
      let res = ObjectStore.queryByYonQL("" + sql);
      for (let prop = 0; prop < res.length; prop++) {
        let itemName = res[prop].MProductTag_code + "&" + res[prop].rpBU;
        if (rebateObj[itemName] == undefined) {
          continue;
        }
        if (res[prop].qty < rebateObj[itemName].fdMainQty) {
          rebateObj[itemName].stockQty = res[prop].qty;
        } else {
          rebateObj[itemName].bPass = true;
        }
      }
      for (let prop in rebateObj) {
        if (rebateObj[prop].bPass == undefined || rebateObj[prop].bPass == false) {
          message += "【" + prop + "】超出返利余额。本次返利金额：" + rebateObj[prop].fdMainQty + ",可返利金额：" + rebateObj[prop].stockQty + "\n";
        }
      }
      if (message != undefined && message != "") {
        throw new Error("提交失败：" + message.replace("undefined", ""));
      }
      //分配库存数量
      let sqlRecord =
        "select  *  from GT4691AT1.GT4691AT1.MRebateAmountLog where rgCustomer='" +
        +mainObj.fmCustomer +
        "' and rpLegalEntity='" +
        mainObj.fmLegalEntity +
        "'  and rpAftQuantity>0 and MProductTag in (" +
        invStr +
        ")   order by MProductTag asc,createTime asc";
      let resRecord = ObjectStore.queryByYonQL("" + sqlRecord);
      let insertRecords = [];
      let updateRecords = [];
      let curTime = mainObj.id + ""; //使用前置订单id作为扣减标识
      function getDate(date) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d;
      }
      let formatDate = getDate(new Date());
      for (let prop = 0; prop < detList.length; prop++) {
        if (detList[prop].fdInvType == "返利品" && detList[prop].fdProMemo == "返利金额") {
          for (let i = 0; i < resRecord.length; i++) {
            if (resRecord[i]["MProductTag"] != detList[prop]["MProductTag"] || resRecord[i]["rpAftQuantity"] <= 0 || resRecord[i]["rpBU"] != detList[prop]["fdBU"]) {
              continue;
            }
            //如果小于
            let redNum =
              resRecord[i]["rpAftQuantity"] >= detList[prop]["fdMainAmount"] - detList[prop]["useQty"] ? detList[prop]["fdMainAmount"] - detList[prop]["useQty"] : resRecord[i]["rpAftQuantity"];
            //修改原记录
            resRecord[i]["rpAftQuantity"] = resRecord[i]["rpAftQuantity"] - redNum;
            let updateRow = {};
            updateRow.id = resRecord[i]["id"];
            updateRow.rpAftQuantity = resRecord[i]["rpAftQuantity"];
            updateRecords.push(updateRow);
            detList[prop]["useQty"] += redNum;
            //插入一行记录
            let inRow = JSON.parse(JSON.stringify(resRecord[i]));
            inRow["rpQuantity"] = 0;
            inRow["rgExQuantity"] = redNum;
            inRow["rpAftQuantity"] = 0;
            inRow["rpId"] = curTime;
            inRow["rpSourceBillCode"] = mainObj.code;
            inRow["logSource"] = "前置订单";
            inRow["rpdDate"] = formatDate;
            inRow["rpPreQuantity"] = resRecord[i]["rpAftQuantity"];
            inRow["rpExMemo"] = resRecord[i]["code"];
            inRow["rpDetId"] = detList[prop]["id"];
            inRow["rpParentId"] = resRecord[i]["id"];
            //记录前置订单单号
            insertRecords.push(inRow);
            if (detList[prop]["useQty"] >= detList[prop].fdMainAmount) {
              break;
            }
          }
        }
      }
      //插入返利金额记录
      let inRes = ObjectStore.insertBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", insertRecords, "7a529c02");
      if (insertRecords.length == 0 || inRes.length != insertRecords.length) {
        throw new Error("提交失败：插入前置订单消费记录失败");
      }
      //更新返利金额数量
      let upRes = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", updateRecords);
      if (updateRecords.length == 0 || upRes.length != updateRecords.length) {
        throw new Error("提交失败：更新返利金额记录失败");
      }
      return {};
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});