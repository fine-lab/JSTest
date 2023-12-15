let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let mainObj = request;
    let detList = mainObj["MFrontSaleOrderDetList"];
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
      "select  rpInv,rpInvCode,rpInvName,sum(rpAftQuantity) as qty,rpBU  from GT4691AT1.GT4691AT1.MRebateProductsLog where rgCustomer='" +
      +mainObj.fmCustomer +
      "' and rpLegalEntityText='" +
      mainObj.fmLegalEntity +
      "'  and rpAftQuantity>0 and rpInv in (" +
      invStr +
      ")  and rpbInStock='是' group by  rpInv,rpInvCode,rpInvName,rpBU ";
    let res = ObjectStore.queryByYonQL("" + sql);
    for (let prop = 0; prop < res.length; prop++) {
      let itemName = res[prop]["rpInvName"] + "&" + res[prop]["rpBU"];
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
        message += "【" + prop + "】超出返利品数量。本次返利数量：" + rebateObj[prop].fdMainQty + ",可返利数量：" + rebateObj[prop].stockQty + "\n";
      }
    }
    if (message != undefined && message != "") {
      throw new Error("" + message.replace("undefined", ""));
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });