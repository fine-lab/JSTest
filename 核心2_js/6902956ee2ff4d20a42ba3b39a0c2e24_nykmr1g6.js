let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let vendorCode = request.vendorCode;
    let vendorId = request.vendorId;
    let orgId = request.orgID;
    let vendorApplyRangeId; //使用组织ID
    //获取供应商列表
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let menchantQueryListUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/digitalModel/vendor/list";
    //获取供应商  vendorApplyRangeId
    let pageIndex = 1;
    let recordCount = 0;
    do {
      let param_vendor_list = { pageIndex: pageIndex + "", pageSize: "50", code: vendorCode };
      let apiResponseList = openLinker("POST", menchantQueryListUrl, apiPreAndAppListCode.appCode, JSON.stringify(param_vendor_list));
      apiResponseList = JSON.parse(jsonParseBefore(apiResponseList));
      throw new Error(JSON.stringify(apiResponseList));
      let data = apiResponseList.data;
      recordCount = data.recordCount;
      if (typeof data != "undefined") {
        for (let i = 0; i < data.recordList.length; i++) {
          if (data.recordList[i].id == vendorId) {
            vendorApplyRangeId = data.recordList[i].vendorApplyRangeId;
            break;
          }
        }
      }
      pageIndex++;
    } while (typeof vendorApplyRangeId == "undefined" && (pageIndex - 1) * 50 < recordCount);
    //获取供应商档案详情
    let menchantQueryUrl = "";
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    if (orgId != undefined && orgId != null) {
      menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/vendor/detail?id=" + vendorId + "&orgId=" + orgId;
    } else {
      menchantQueryUrl = apiPreAndAppCode.apiPrefix + "/yonbip/digitalModel/vendor/detail?id=" + vendorId + "&vendorApplyRangeId=" + vendorApplyRangeId;
    }
    let apiResponse = openLinker("GET", menchantQueryUrl, apiPreAndAppCode.appCode, null);
    let obj = JSON.parse(apiResponse);
    var merchantInfo;
    if (obj.code == 200) {
      merchantInfo = obj.data;
    } else {
      throw new Error("供应商档案详情查询接口异常" + obj.message);
    }
    return { merchantInfo };
  }
}
exports({ entryPoint: MyAPIHandler });