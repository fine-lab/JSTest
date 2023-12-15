let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let params = request.params;
    let vendorId = request.vendorId;
    let snDetail = request.snDetail;
    let sql = "select code supplierCode,con.contactmobile,con.defaultcontact,con.contactphone,con.contactname from aa.vendor.Vendor ";
    sql += " inner join aa.vendor.VendorContacts con on con.vendor = id ";
    sql += " where id = " + vendorId;
    var res = ObjectStore.queryByYonQL(sql, "yssupplier");
    params.supplierCode = res[0].code;
    let contact = res[0];
    for (let i = 0; i < res.length; i++) {
      if (res[i].defaultcontact) {
        contact = res[i];
        break;
      }
    }
    params.contact = contact.con_contactname;
    if (contact.con_contactmobile) {
      params.telNo = contact.con_contactmobile;
    } else {
      params.telNo = contact.con_contactphone;
    }
    // 非必填字段设置
    if (!params.telNo) {
      params.telNo = "";
    }
    if (!params.contact) {
      params.contact = "";
    }
    if (!params.expressName) {
      params.expressName = "";
    }
    if (!params.tractorNo) {
      params.tractorNo = "";
    }
    if (!params.driverName) {
      params.driverName = "";
    }
    if (!params.est) {
      params.est = "";
    }
    if (!params.driverTel) {
      params.driverTel = "";
    }
    return {};
    function getDate() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = date.getFullYear() + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1 + "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      timeStr += " ";
      timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      timeStr += ":";
      timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeStr += ":";
      timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return timeStr;
    }
  }
}
exports({ entryPoint: MyAPIHandler });