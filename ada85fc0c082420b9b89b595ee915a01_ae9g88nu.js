let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let sourceautoid = 1;
    let sourceid = 1;
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var token = obj.token;
    let apiRestPre = "https://www.example.com/";
    let url = apiRestPre + "/gsp/stopOrderBackWrite";
    let sourceids = [];
    sourceids.push(sourceid);
    let str_stockstate = 1;
    let json = { detailids: sourceids, audittype: "0", stockstate: str_stockstate };
    let header = {
      "Content-Type": "application/json",
      yht_access_token: token
    };
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(json));
    let info = JSON.parse(apiResponse);
    if (info.code != 200) {
      throw new Error(JSON.stringify(info.message));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });