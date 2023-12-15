let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let dataObj = param.data[0];
    let id = dataObj.id;
    let purchaseOrdersList = dataObj.purchaseOrders;
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let callbackUrl = DOMAIN + "/yonbip/sd/voucherorder/singleSave";
    let queryUrl = DOMAIN + "/yonbip/sd/voucherorder/detail";
    let sysDefineUrl = DOMAIN + "/yonbip/sd/api/updateDefinesInfo";
    let extendSrcBillIdArray = [];
    openLinker(
      "POST",
      logToDBUrl,
      "GT3734AT5",
      JSON.stringify({ LogToDB: true, logModule: 9, description: "删除--反写销售订单-0", reqt: JSON.stringify(purchaseOrdersList), resp: extendSrcBillIdArray.toString(), usrName: usrName })
    );
    let srcBill = dataObj.srcBill;
    for (var i in purchaseOrdersList) {
      let purchaseOrders = purchaseOrdersList[i];
      let extendSrcBillId = purchaseOrders.extendSrcBillId;
      let extendSrcBillNo = purchaseOrders.extendSrcBillNo;
      let extendSrcBillEntryId = purchaseOrders.extendSrcBillEntryId;
      if (extendSrcBillId == undefined || extendSrcBillId == "") {
        continue;
      }
      let sysDefineBody = {
        billnum: "voucher_order",
        datas: []
      };
      defineObj59 = {
        id: extendSrcBillId,
        code: extendSrcBillNo,
        definesInfo: [
          {
            define59: 0,
            isHead: false,
            isFree: true,
            detailIds: extendSrcBillEntryId
          }
        ]
      };
      defineObj60 = {
        id: extendSrcBillId,
        code: extendSrcBillNo,
        definesInfo: [
          {
            define60: 0,
            isHead: false,
            isFree: true,
            detailIds: extendSrcBillEntryId
          }
        ]
      };
      sysDefineBody.datas.push(defineObj60);
      let respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
      openLinker(
        "POST",
        logToDBUrl,
        "GT3734AT5",
        JSON.stringify({ LogToDB: true, logModule: 9, description: "删除--反写销售订单-1", reqt: JSON.stringify(sysDefineBody), resp: respSaveDefine, usrName: usrName })
      );
      sysDefineBody.datas[0] = defineObj59;
      respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
      openLinker(
        "POST",
        logToDBUrl,
        "GT3734AT5",
        JSON.stringify({ LogToDB: true, logModule: 9, description: "删除--反写销售订单-2", reqt: JSON.stringify(sysDefineBody), resp: respSaveDefine, usrName: usrName })
      );
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });