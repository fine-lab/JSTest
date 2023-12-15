let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let row = request.rows[0];
    let config = new Object();
    config.agentId = row.agentId;
    config.corpId = row.corpId;
    config.appkey = row.appkey;
    config.appsecret = row.appsecret;
    config.thirdUcId = row.thirdUcId;
    config.thirdUcIds = row.thirdUcIds;
    config.tenantId = request.tenantId;
    var strResponse = postman("POST", "http://124.70.66.31:9002/configInsert", null, JSON.stringify(config));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });