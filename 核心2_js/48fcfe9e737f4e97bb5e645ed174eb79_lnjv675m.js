let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let user = JSON.parse(AppContext());
    let staffId = user.currentUser.staffId;
    let func1 = extrequire("GT34544AT7.common.getOpenApiToken");
    let res = func1.execute({});
    let apiResponse = postman("get", "https://www.example.com/" + res.access_token + "&id=" + staffId, null, null);
    apiResponse = JSON.parse(apiResponse);
    let ptJobList = apiResponse.data.ptJobList;
    let orgid = "yi";
    if (ptJobList !== undefined && ptJobList !== null && ptJobList !== undefined) {
      for (let a = 0; a < ptJobList.length; a++) {
        if (ptJobList[a].job_id_name == "资金维护员") {
          orgid = ptJobList[a].org_id;
        }
      }
    }
    let mainJobList = apiResponse.data.mainJobList;
    if (mainJobList !== undefined && mainJobList !== null && mainJobList !== undefined) {
      for (let a = 0; a < mainJobList.length; a++) {
        if (mainJobList[a].job_id_name == "资金维护员") {
          orgid = mainJobList[a].org_id;
        }
      }
    }
    return { res: orgid };
  }
}
exports({ entryPoint: MyAPIHandler });