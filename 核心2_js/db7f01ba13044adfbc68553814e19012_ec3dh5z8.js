let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      id: request.id,
      fpzt: request.fpzt
    };
    let wayUrlfunc = extrequire("SCMSA.utils.getWayUrl");
    let wayres = wayUrlfunc.execute(null);
    let gatewayUrl = wayres.gatewayUrl;
    //租户id
    let tenantId = ObjectStore.user().tenantId;
    let getExchangerate = gatewayUrl + "/" + tenantId + "/myAPI/myModular/updateTaxNoStatus";
    let rateResponse = openLinker("POST", getExchangerate, "AT1590F01809B00007", JSON.stringify(body));
    let rateresponseobj = JSON.parse(rateResponse);
    return { rateresponseobj };
  }
}
exports({ entryPoint: MyAPIHandler });