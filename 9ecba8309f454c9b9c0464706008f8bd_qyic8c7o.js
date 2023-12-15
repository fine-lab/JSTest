let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var staffId = currentUser.staffId; //'3156481455755534';
    var yhtuserid = "";
    var result = {};
    let url = "https://www.example.com/" + staffId;
    let apiResponse = openLinker("GET", url, "AT170DEAD017A80007", JSON.stringify({}));
    var psnObjs = JSON.parse(apiResponse).data;
    result.psnObj = psnObjs;
    if (psnObjs && psnObjs.length > 0) {
      var jobs = psnObjs[0].staff_job;
      if (jobs && jobs.length > 0) {
        var accountOrgId = jobs[0].accountOrgId;
        var res = ObjectStore.selectByMap("AT170DEAD017A80007.AT170DEAD017A80007.org_Approve", { baseOrg: accountOrgId });
        if (res && res.length > 0) {
          yhtuserid = res[0].yhtuserid;
        }
      }
    }
    return yhtuserid;
  }
}
exports({ entryPoint: MyAPIHandler });