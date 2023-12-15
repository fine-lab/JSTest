let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tenantid = obj.currentUser.tenantId;
    // 时间格式化方法
    var dateFormat = function (date, format) {
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    let audiYonql = "select id,org_id,code,supplier from 	GT22176AT10.GT22176AT10.SY01_supcauditv2 where dr = 0 and id = '" + param.data[0].id + "'";
    let auditRes = ObjectStore.queryByYonQL(audiYonql, "sy01")[0];
    //租户是否开启wms
    let sql = "select * from 	GT22176AT10.GT22176AT10.sy01_tenant_param_config where dr = 0 and ( param like 'CQGYWms' or param like 'CQGYWMS' or param like 'CQGY')";
    let config = ObjectStore.queryByYonQL(sql, "sy01")[0];
    if (config == null || config == undefined || config.paramState == "0") {
      return;
    }
    //获取当前租户所在数据中心gatewayUrl
    const dataCenterUrl = "https://www.example.com/" + tenantid;
    let gatewayUrl = postman("get", dataCenterUrl, null, null);
    let responseJson = JSON.parse(gatewayUrl);
    let apiPrefix = responseJson.data.gatewayUrl;
    //沙箱环境
    var apiRestPre = "https://www.example.com/";
    if (apiPrefix == "https://www.example.com/" || apiPrefix == "https://www.example.com/") {
      //核心三
      apiRestPre = "https://www.example.com/";
    }
    var salt = "|shangyang_1981101269976576|";
    // 时间戳，精确到分钟
    var timestampStr = dateFormat(new Date(), "yyyy-MM-dd HH:mm");
    //为防止被攻击，添加签名校验
    var objstr = tenantid + salt + timestampStr;
    var sign = MD5Encode(objstr);
    // 拼装请求报文
    var obj = { tenantId: tenantid, logId: "yourIdHere", time: timestampStr, type: "2", uuid: sign, orgId: auditRes.org_id, clientId: auditRes.supplier, userId: ObjectStore.user().id };
    //获取api前缀等信息 参数： 请求方式 ， 地址  ，header ， body
    var strResponse = postman("post", apiRestPre + "/gsp/wms/cqgyClientPush", null, JSON.stringify(obj));
  }
}
exports({
  entryPoint: MyTrigger
});