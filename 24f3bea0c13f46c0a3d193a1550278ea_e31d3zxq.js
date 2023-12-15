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
    var obj = { tenantId: tenantId, time: timestampStr, uuid: sign, userId: ObjectStore.user().id };
    if (type == 1) {
      //销售发货
      let deliveryOrderSql = "select id from 	voucher.delivery.DeliveryVoucher where id ='" + orderId + "' ";
      let deliveryOrderRes = ObjectStore.queryByYonQL(deliveryOrderSql, "udinghuo");
      if (deliveryOrderRes.length == 0) {
        return;
      }
      obj.deliveryOrderId = orderId;
      obj.logId = "yourIdHere";
    } else if (type == 2) {
      //销售发货删除
      let deliveryOrderSql = "select id from 	voucher.delivery.DeliveryVoucher where id ='" + orderId + "' ";
      let deliveryOrderRes = ObjectStore.queryByYonQL(deliveryOrderSql, "udinghuo");
      if (deliveryOrderRes.length == 0) {
        return;
      }
      obj.deliveryOrderId = orderId;
      obj.logId = "yourIdHere";
    } else if (type == 3) {
      //销售退货
      let saleReturnSql = "select id  from voucher.salereturn.SaleReturn where id ='" + orderId + "' ";
      let saleReturnRes = ObjectStore.queryByYonQL(saleReturnSql, "udinghuo");
      if (saleReturnRes.length == 0) {
        return;
      }
      obj.saleReturnId = orderId;
      obj.logId = "yourIdHere";
    } else if (type == 4) {
      //销售退货删除
      let saleReturnSql = "select id  from voucher.salereturn.SaleReturn where id ='" + orderId + "' ";
      let saleReturnRes = ObjectStore.queryByYonQL(saleReturnSql, "udinghuo");
      if (saleReturnRes.length == 0) {
        return;
      }
      obj.saleReturnId = orderId;
      obj.logId = "yourIdHere";
    } else if (type == 5) {
      //报损单推送销售出库
      obj.damageId = orderId;
      obj.logId = "yourIdHere";
    } else if (type == 6) {
      //报损单删除推送销售出库起效
      obj.damageId = orderId;
      obj.logId = "yourIdHere";
    }
    var strResponse = postman("post", "https://www.example.com/" + obj.logId, null, JSON.stringify(obj));
    let jsonRes = JSON.parse(strResponse);
    if (jsonRes.code != "200") {
      if (jsonRes.message.indexOf("记录已存在") == -1) {
        throw new Error("操作失败，推送富勒系统失败原因：" + jsonRes.message);
      }
    }
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });