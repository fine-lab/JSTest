let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var third_uc_id = request.data.third_uc_id;
    var app_key = request.data.app_key;
    var app_secret = request.data.app_secret;
    var sso_callback_url = request.data.sso_callback_url;
    var apply = request.data.apply;
    var tenant_id = request.data.tenant_id;
    var id = request.data.id;
    var body = {
      id: id,
      apply: apply,
      ssoCallbackUrl: sso_callback_url,
      appSecret: app_secret,
      thirdUcId: third_uc_id,
      appKey: app_key,
      tenantId: tenant_id
    };
    var header = {};
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });