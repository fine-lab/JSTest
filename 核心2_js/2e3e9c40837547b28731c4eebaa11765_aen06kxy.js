let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT6948AT29.common.getOpenApiToken");
    let res = func1.execute(request);
    let access_token = res.access_token;
    var currentUser = JSON.parse(AppContext()).currentUser;
    var tenantId = currentUser.tenantId;
    var userids = currentUser.id;
    const header = {
      "Content-Type": "application/json"
    };
    const body = {
      userId: userids,
      serviceCode: "GZTACT030",
      tenantId: tenantId
    };
    var api_reponse = postman("post", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(body));
    var org_data = JSON.parse(api_reponse);
    return { org_data: org_data, userId: userids, serviceCode: "GZTACT030", tenantId: tenantId };
  }
}
exports({ entryPoint: MyAPIHandler });