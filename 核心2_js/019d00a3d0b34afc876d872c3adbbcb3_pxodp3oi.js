let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let yhCode = pdata.code;
    throw new Error(JSON.stringify(param));
    let CPMXList = pdata.CPMXList;
    if (CPMXList == null || CPMXList.length == 0) {
      return { rst: true };
    }
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let commUrl = DOMAIN + "/yonbip/scm/purchaseorder/updateDefinesInfo";
    for (var i in CPMXList) {
      let cpmxObj = CPMXList[i];
      let srcBillEntryId = cpmxObj.srcBillEntryId; // : "1713351635242582024"
      if (srcBillEntryId == undefined || srcBillEntryId == "") {
        continue;
      }
      let source_id = cpmxObj.source_id; // : "1713351635242582023"
      let paramsBody = { datas: [{ id: source_id, definesInfo: [{ define1: yhCode, isHead: false, isFree: true, detailIds: srcBillEntryId }] }] };
      let commResp = openLinker("POST", commUrl, "GT3734AT5", JSON.stringify(paramsBody));
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });