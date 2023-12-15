let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
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
    let orderId = request.orderId;
    let tenantId = request.tenantId;
    if (tenantId != "x9ekhxys") {
      return;
    }
    let type = request.type;
    var salt = "|shangyang_1981101269976576|";
    // 时间戳，精确到分钟
    var timestampStr = dateFormat(new Date(), "yyyy-MM-dd HH:mm");
    //为防止被攻击，添加签名校验
    var objstr = tenantId + salt + timestampStr;
    var sign = MD5Encode(objstr);
    // 拼装请求报文
    var obj = { tenantId: tenantId, time: timestampStr, uuid: sign, userId: ObjectStore.user().id, auditId: orderId };
    if (type == 1) {
      //首营商品审批
      obj.logId = "yourIdHere";
      obj.isAudit = "Y";
    } else if (type == 2) {
      //首营商品变更
      obj.logId = "yourIdHere";
      obj.isAudit = "N";
    } else if (type == 3) {
      //首营客户审批
      obj.logId = "yourIdHere";
      obj.type = "1";
      obj.isAudit = "Y";
    } else if (type == 4) {
      //首营客户变更
      obj.logId = "yourIdHere";
      obj.type = "1";
      obj.isAudit = "N";
    } else if (type == 5) {
      //首营供应商审批
      let audiYonql = "select id,org_id,code from 		GT22176AT10.GT22176AT10.SY01_fccompauditv4 where dr = 0 and id = '" + orderId + "'";
      let auditRes = ObjectStore.queryByYonQL(audiYonql, "sy01")[0];
      obj.logId = "yourIdHere";
      obj.orgId = auditRes.org_id;
      obj.type = "2";
      obj.isAudit = "Y";
    } else if (type == 6) {
      //首营供应商变更
      let audiYonql = "select id,org_id,code,supplier from 	GT22176AT10.GT22176AT10.SY01_supcauditv2 where dr = 0 and id = '" + orderId + "'";
      let auditRes = ObjectStore.queryByYonQL(audiYonql, "sy01")[0];
      obj.logId = "yourIdHere";
      obj.orgId = auditRes.org_id;
      obj.type = "2";
      obj.isAudit = "N";
    }
    var strResponse = postman("post", "https://www.example.com/" + obj.logId, null, JSON.stringify(obj));
    let jsonRes = JSON.parse(strResponse);
    if (jsonRes.code != "200") {
      throw new Error("操作失败，推送富勒系统失败原因：" + jsonRes.message);
    }
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });