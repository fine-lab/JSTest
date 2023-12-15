let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var staffId = request.staffId;
    var currentUser = JSON.parse(AppContext()).currentUser;
    if (!staffId) {
      staffId = currentUser.staffId;
    }
    var yhtuserid = "";
    var result = {};
    let url = "https://www.example.com/" + staffId;
    let apiResponse = openLinker("GET", url, "ycReqManagement", JSON.stringify({}));
    var psnObjs = JSON.parse(apiResponse).data;
    result.psnObj = psnObjs;
    var accountOrgId = "";
    var accountOrgName = "";
    var accountOrgCode = "";
    if (psnObjs && psnObjs.length > 0) {
      var jobs = psnObjs[0].staff_job;
      if (jobs && jobs.length > 0) {
        accountOrgId = jobs[0].accountOrgId;
      }
    }
    if (!accountOrgId || accountOrgId == "") {
      accountOrgId = currentUser.orgId;
    }
    let orgurl = "https://www.example.com/" + accountOrgId;
    let orgResponse = openLinker("GET", orgurl, "ycReqManagement", JSON.stringify({}));
    var orgObj = JSON.parse(orgResponse).data;
    accountOrgName = orgObj.name;
    accountOrgCode = orgObj.code;
    if (typeof accountOrgName == "object" && accountOrgName) {
      accountOrgName = accountOrgName.zh_CN;
    }
    return { accountOrgId, accountOrgCode, accountOrgName };
  }
}
exports({ entryPoint: MyAPIHandler });