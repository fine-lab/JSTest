let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appId = request.appId;
    // 设置默认状态-1
    let status = -1;
    // 设置默认消息
    let msg = "";
    // 租户信息
    let tenant = {};
    // 应用信息
    let app = {};
    if (appId == undefined) {
      throw new Error("请求中找不到AppId");
    }
    let context = JSON.parse(AppContext());
    let tenantId = request.tenantId ? request.tenantId : context.currentUser.tenantId;
    request.tenantId = tenantId;
    let getUrl = extrequire("GT53685AT3.common.getBaseUrl");
    let resurl = getUrl.execute(request).res;
    let gatewayUrl = resurl.data.gatewayUrl;
    let tokenUrl = resurl.data.tokenUrl;
    var tenantobject = { tenantId: tenantId };
    var restenant = ObjectStore.selectByMap("GT53685AT3.GT53685AT3.tenantManager", tenantobject);
    if (restenant.length == 1) {
      tenant = restenant[0];
      if (tenant.baseUrl == undefined || tenant.baseTokenUrl == undefined) {
        var updateWrapper = new Wrapper();
        updateWrapper.eq("tenantId", tenantId);
        var toUpdate = {
          baseUrl: gatewayUrl,
          baseTokenUrl: tokenUrl,
          _status: "Update"
        };
        var resuptenant = ObjectStore.update("GT53685AT3.GT53685AT3.tenantManager", toUpdate, updateWrapper, "95277cad");
        tenant = resuptenant[0];
      }
    } else {
      tenant.baseUrl = gatewayUrl;
      tenant.baseTokenUrl = tokenUrl;
      tenant.tenantId = tenantId;
      tenant._status = "Insert";
      var tenantres = ObjectStore.insert("GT53685AT3.GT53685AT3.tenantManager", tenant, "95277cad");
    }
    var appobject = { tenantManager_id: tenant.id, tenantId: tenantId, tenantId: tenantId, tenantAppId: appId };
    var appres = ObjectStore.selectByMap("GT53685AT3.GT53685AT3.appManager", appobject);
    if (appres.length == 0) {
      var updateWrapper1 = new Wrapper();
      updateWrapper1.eq("tenantId", tenantId);
      var toUpdate1 = {
        baseUrl: gatewayUrl,
        baseTokenUrl: tokenUrl,
        appManagerList: [{ tenantId: tenantId, tenantAppId: appId, _status: "Insert" }],
        _status: "Update"
      };
      var resuptenant1 = ObjectStore.update("GT53685AT3.GT53685AT3.tenantManager", toUpdate, updateWrapper, "95277cad");
      tenant = resuptenant1[0];
      status = 0;
      msg = "没有配置appKey和appSecret!";
    } else {
      if (appres.length > 1) {
        status = 3;
        msg = "拥有多条重复信息，请联系管理员删除!";
      } else {
        app = appres[0];
        status = 1;
        msg = "获取默认配置成功!";
      }
    }
    let res = {
      status: status,
      msg: msg,
      config: { appId: appId }
    };
    if (!!tenant.baseUrl) {
      res.config.baseApiUrl = tenant.baseUrl;
    }
    if (!!tenant.baseTokenUrl) {
      res.config.baseTokenUrl = tenant.baseTokenUrl;
    }
    if (!!app.tenantAppKey) {
      res.config.appkey = app.tenantAppKey;
    }
    if (!!app.tenantAppSecret) {
      res.config.appSecret = app.tenantAppSecret;
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });