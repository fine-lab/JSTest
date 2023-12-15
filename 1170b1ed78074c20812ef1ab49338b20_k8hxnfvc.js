let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var orgId = request.orgId;
    var result = {};
    let url = "	https://c1.yonyoucloud.com/iuap-api-gateway/yonbip/digitalModel/staff/detail?id=" + id;
    let apiResponse = openLinker("GET", url, "ycContractManagement", JSON.stringify({}));
    var psnObj = JSON.parse(apiResponse).data;
    result.psnObj = psnObj;
    var mainJobList = psnObj.mainJobList;
    var ptJobList = psnObj.ptJobList;
    var targetOrgId = "";
    var targetOrgName = "";
    var targetOrgCode = "";
    if (mainJobList && mainJobList.length > 0) {
      for (var ii = 0; ii < mainJobList.length; ii++) {
        if (mainJobList[ii].org_id == orgId) {
          var targetOrgId = mainJobList[ii].account_org_id;
          break;
        }
      }
    }
    if ((!targetOrgId || targetOrgId == "") && ptJobList && ptJobList.length > 0) {
      for (var ij = 0; ij < ptJobList.length; ij++) {
        if (ptJobList[ij].org_id == orgId) {
          var targetOrgId = ptJobList[ij].account_org_id;
          break;
        }
      }
    }
    if (!targetOrgId || targetOrgId == "") {
      targetOrgId = orgId;
    }
    result.targetOrgId = targetOrgId;
    let orgurl = "https://www.example.com/" + targetOrgId;
    let orgResponse = openLinker("GET", orgurl, "ycContractManagement", JSON.stringify({}));
    var orgObj = JSON.parse(orgResponse).data;
    targetOrgName = orgObj.name;
    targetOrgCode = orgObj.code;
    if (typeof targetOrgName == "object" && targetOrgName) {
      targetOrgName = targetOrgName.zh_CN;
    }
    return { targetOrgId, targetOrgCode, targetOrgName };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });