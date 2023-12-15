let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bizFlowWriteBackSign = JSON.parse(param.requestData).bizFlowWriteBackSign;
    if (bizFlowWriteBackSign === "bizFlowWriteBackSign") {
      return {};
    }
    let mainObj = param.data[0];
    let new35 = mainObj.new35;
    if (new35 === "全部拆单") {
      return {};
    }
    let actionSource = context.billnum;
    let actionName = context.action.toLowerCase();
    let debuginfo = { mainObj: mainObj, context: context };
    if (mainObj.fdOrderSource === "经销商") {
      if (["a497e816", "a497e816List"].indexOf(actionSource) >= 0 && actionName.indexOf("save") >= 0) {
        return {};
      }
    }
    let detList = ObjectStore.queryByYonQL('select *,MProductTag.code as MProductTag_code from GT4691AT1.GT4691AT1.MFrontSaleOrderDet  where dr=0 and MFrontSaleOrderDetFk  ="' + mainObj.id + '"');
    //客户、法律实体、涉及物料
    //取出返利金额
    {
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
        "select  MProductTag,MProductTag.code as MProductTag_code,MProductTag.ptagname as MProductTag_name,sum(rpAftQuantity) as qty,rpBU  from GT4691AT1.GT4691AT1.MRebateAmountLog where dr=0 and rgCustomer='" +
        mainObj.fmCustomer +
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
          message += "【" + prop + "】超出返利余额。本次返利金额：" + rebateObj[prop].fdMainQty + ",返利余额：" + rebateObj[prop].stockQty + "\n";
        }
      }
      if (message != undefined && message != "") {
        throw new Error("保存失败：" + message.replace("undefined", ""));
      }
    }
    //返利赠品
    {
      //客户、法律实体、涉及物料
      //取出返利品
      let message;
      let rebateObj = {};
      let invStr = "";
      for (let prop = 0; prop < detList.length; prop++) {
        if (detList[prop].fdInvType == "返利品" && detList[prop].fdProMemo == "返利赠品") {
          detList[prop]["useQty"] = 0;
          let itemName = detList[prop]["fdInvName"] + "&" + detList[prop]["fdBU"];
          if (rebateObj[itemName] == undefined) {
            rebateObj[itemName] = { fdMainQty: 0, rowId: detList[prop]["id"], useQty: 0, fdRebateUid: "", stockQty: 0 };
            invStr += detList[prop]["fdInv"] + ",";
          }
          rebateObj[itemName]["fdMainQty"] += detList[prop].fdMainQty;
        }
      }
      //没有返利品
      if (Object.keys(rebateObj).length <= 0) {
        return {};
      }
      invStr = invStr.substring(0, invStr.length - 1);
      //判断库存是否富裕
      let sql =
        "select  rpInv,rpInvCode,rpInvName,sum(rpAftQuantity) as qty,rpBU  from GT4691AT1.GT4691AT1.MRebateProductsLog where dr=0 and rgCustomer='" +
        +mainObj.fmCustomer +
        "' and rpLegalEntityText='" +
        mainObj.fmLegalEntityName +
        "'  and rpAftQuantity>0 and rpInv in (" +
        invStr +
        ")  and rpbInStock='是' group by  rpInv,rpInvCode,rpInvName,rpBU ";
      let res = ObjectStore.queryByYonQL("" + sql);
      for (let prop = 0; prop < res.length; prop++) {
        let itemName = res[prop].rpInvName + "&" + res[prop].rpBU;
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
          message += "【" + prop + "】超出返利赠品数量。本次返利数量：" + rebateObj[prop].fdMainQty + ",返利池数量：" + rebateObj[prop].stockQty + "\n";
        }
      }
      if (message != undefined && message != "") {
        throw new Error("保存失败：" + message.replace("undefined", ""));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });