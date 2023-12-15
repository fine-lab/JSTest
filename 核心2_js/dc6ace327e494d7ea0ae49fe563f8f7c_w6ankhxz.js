let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取配置文件信息
    let appContext = AppContext();
    let obj = JSON.parse(appContext);
    let tid = obj.currentUser.tenantId;
    let func1 = extrequire("AT15F21D9001880006.BackApi.getUrl");
    let res = func1.execute(null, null);
    let sql = "select ysappkey,ysappsecret,hunpunkey,hunpunsecret from AT15F21D9001880006.AT15F21D9001880006.hunPun_config where dr=0 and tenant_id='" + tid + "'";
    let configRes = ObjectStore.queryByYonQL(sql);
    let config = new Object();
    if (configRes.length > 0) {
      config.key = configRes[0].hunpunkey;
      config.secret = configRes[0].hunpunsecret;
      config.appKey = configRes[0].ysappkey;
      config.appSecret = configRes[0].ysappsecret;
      config.tenantId = tid;
      config.bodyParam = param;
    }
    var strResponse = postman("POST", res.url + "/saleOrderOutReceivable/saleOrderOutReceivableTask", null, JSON.stringify(config));
  }
}
exports({ entryPoint: MyTrigger });