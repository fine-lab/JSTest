let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let APPCODE = "GT3734AT5"; //应用AppCode-固定值
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let queryUrl = DOMAIN + "/yonbip/sd/voucherorder/detail";
    let purchaseUrl = DOMAIN + "/yonbip/scm/purchaseorder/detail"; //采购订单查询接口
    let purchaseRes = openLinker("GET", purchaseUrl + "?id=" + id, "GT3734AT5", JSON.stringify({ id: id }));
    let purResDataObj = JSON.parse(purchaseRes).data;
    let purchaseOrdersList = purResDataObj.purchaseOrders;
    let purOrdersList = [];
    for (var i in purchaseOrdersList) {
      let purchaseOrders = purchaseOrdersList[i];
      let extendSrcBillId = purchaseOrders.extendSrcBillId;
      let extendSrcBillNo = purchaseOrders.extendSrcBillNo;
      let extendSrcBillEntryId = purchaseOrders.extendSrcBillEntryId;
      if (extendSrcBillId == undefined || extendSrcBillId == "") {
        continue;
      }
      let isExist = false;
      for (var j in purOrdersList) {
        if (extendSrcBillId == purOrdersList[j].extendSrcBillId) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        purOrdersList.push(extendSrcBillId);
      }
    }
    if (purOrdersList.length == 0) {
      return { rst: true };
    }
    for (var k in purOrdersList) {
      let extendSrcBillId = purOrdersList[k];
      let apiResponse = openLinker("GET", queryUrl + "?id=" + extendSrcBillId, APPCODE, JSON.stringify({ id: extendSrcBillId }));
      let resDataObj = JSON.parse(apiResponse).data;
      if (resDataObj == undefined || resDataObj == null) {
        continue;
      }
      let define58 = resDataObj.define58;
      let define57 = resDataObj.define57;
      let define54 = resDataObj.define54;
      let define53 = resDataObj.define53;
      if ((define53 != undefined && define53 != "") || (define54 != undefined && define54 != "") || (define57 != undefined && define57 != "") || (define58 != undefined && define58 != "")) {
        throw new Error("订单已经生成暂估凭证，不能弃审!");
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });