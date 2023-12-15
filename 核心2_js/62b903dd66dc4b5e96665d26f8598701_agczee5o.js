let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appContext = JSON.parse(AppContext());
    let currentUser = appContext.currentUser;
    let body = {};
    let header = {
      userId: currentUser.id,
      tenantId: currentUser.tenantId,
      yht_access_token: appContext.token
    };
    let strResponse = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    strResponse = JSON.parse(strResponse);
    if (strResponse.code != 200) {
      throw Error(JSON.stringify(strResponse));
    }
    return { strResponse: strResponse };
  }
}
exports({ entryPoint: MyTrigger });