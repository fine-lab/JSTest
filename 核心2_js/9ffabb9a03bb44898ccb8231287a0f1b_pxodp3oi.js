let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let dataObj = param.data[0];
    let id = dataObj.id;
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let callbackUrl = DOMAIN + "/yonbip/sd/voucherorder/singleSave";
    let queryUrl = DOMAIN + "/yonbip/scm/purchaseorder/detail"; //采购订单查询接口
    let sysDefineUrl = DOMAIN + "/yonbip/sd/api/updateDefinesInfo";
    let extendSrcBillIdArray = [];
    let srcBill = dataObj.srcBill;
    let apiResponse = openLinker("GET", queryUrl + "?id=" + id, "GT3734AT5", JSON.stringify({ id: id }));
    let resDataObj = JSON.parse(apiResponse).data;
    let purchaseOrdersList = resDataObj.purchaseOrders;
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
      let defineObj59 = {
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
      let defineObj60 = {
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
      let defineObj56 = {
        id: extendSrcBillId,
        code: extendSrcBillNo,
        definesInfo: [
          {
            define56: "",
            isHead: false,
            isFree: true,
            detailIds: extendSrcBillEntryId
          }
        ]
      };
      let defineObj55 = {
        id: extendSrcBillId,
        code: extendSrcBillNo,
        definesInfo: [
          {
            define55: "",
            isHead: false,
            isFree: true,
            detailIds: extendSrcBillEntryId
          }
        ]
      };
      sysDefineBody.datas.push(defineObj60);
      let respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
      sysDefineBody.datas[0] = defineObj59;
      respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
      sysDefineBody.datas[0] = defineObj56;
      respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
      sysDefineBody.datas[0] = defineObj55;
      respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });