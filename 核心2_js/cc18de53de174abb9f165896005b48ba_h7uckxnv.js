let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rows = request.rows;
    for (var i = 0; i < rows.length; i++) {
      let row = rows[i];
      let appkey = row.appkey;
      let appsecret = row.appsecret;
      let timestamp = parseInt(Date.now() / 1000);
      let state = "test";
      let charset = "UTF-8";
      let unsign = appsecret + "app_key" + appkey + "charset" + charset + "state" + state + "timestamp" + timestamp;
      let sign = MD5Encode(unsign);
      let url = "https://www.example.com/" + appkey + "&timestamp=" + timestamp + "&charset=UTF-8&sign=" + sign + "&state=test";
      var updateWrapper = new Wrapper();
      updateWrapper.eq("appkey", appkey);
      // 待更新字段内容
      var toUpdate = { shouquandizhi: url };
      // 执行更新
      var res = ObjectStore.update("AT167004801D000002.AT167004801D000002.jst_config", toUpdate, updateWrapper, "e91bc0cf");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });