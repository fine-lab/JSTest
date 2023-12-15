let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let detList = request["MFrontSaleOrderDetList"];
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
      +request.fmCustomer +
      "' and rpLegalEntity='" +
      request.fmLegalEntity +
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
        message += "【" + prop + "】超出返利余额。本次返利金额：" + rebateObj[prop].fdMainQty + ",可返利余额：" + rebateObj[prop].stockQty + "。\n";
      }
    }
    if (message != undefined && message != "") {
      throw new Error("" + message.replace("undefined", ""));
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });