let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
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
    var now = new Date();
    var audit_time = dateFormat(now, "yyyy-MM-dd HH:mm:ss");
    var tenantid = request.TenantId;
    var userId = request.UserId;
    let result_tf = false;
    let message = "测试错误";
    let back;
    let apply_id = request.apply_id;
    var billObj = {
      id: apply_id,
      compositions: [
        {
          name: "CustomerApply",
          compositions: [
            {
              name: "CustomerApplyDef"
            }
          ]
        }
      ]
    };
    //实体查询
    var billInfo = ObjectStore.selectById("aa.customerapply.CustomerApply", billObj);
    var res_json = billInfo.customerData;
    var detail_bill = JSON.parse(res_json);
    //证照列表
    var effectTime = audit_time;
    if (billInfo.effectTime != undefined) {
      effectTime = billInfo.effectTime;
    }
    var license = detail_bill.SY01_customer_licenseList;
    if (license != undefined && license != null) {
      for (let i = 0; i < license.length; i++) {
        for (let j = i + 1; j < license.length; j++) {
          if (license[i].license_type == license[j].license_type && license[i].license_code == license[j].license_code) {
            message = "GMP客户证照异常，存在重复的证照即证照类型，证照编码完全相同";
            back = { result_tf: result_tf, message: message, billInfo: request };
            return back;
          }
        }
      }
      var object = {
        tenant_id: tenantid,
        customer_code: billInfo.merchantCode,
        org_id: billInfo.applicationOrg,
        applyer: billInfo.bizOperator,
        depart: billInfo.applyDepartment,
        audit_time: audit_time,
        effect_time: effectTime,
        customer_apply_id: apply_id
      };
      const dataCenterUrl = "https://www.example.com/" + tenantid;
      let gatewayUrl = postman("get", dataCenterUrl, null, null);
      let responseJson = JSON.parse(gatewayUrl);
      let apiPrefix = responseJson.data.gatewayUrl;
      //沙箱环境
      var apiRestPre = "https://www.example.com/";
      if (apiPrefix != "https://www.example.com/") {
        //生产环境
        apiRestPre = "https://www.example.com/";
      }
      //灰度
      if (tenantid == "fgzxvvu3" || apiPrefix == "https://www.example.com/") {
        apiRestPre = "https://www.example.com/";
      }
      var strResponse = postman("post", apiRestPre + "/gsp/applyAuditToGMPSave", null, JSON.stringify(object));
      var json_response = JSON.parse(strResponse);
      message = "";
      result_tf = true;
      if (json_response.error != undefined) {
        message = json_response.error;
        result_tf = false;
      } else if (json_response.Error != undefined) {
        message = json_response.error;
        result_tf = false;
      } else if (json_response.code != 200) {
        message = "证照保存异常";
        result_tf = false;
      }
      back = { result_tf: result_tf, message: message, billInfo: request };
      return back;
    } else {
      result_tf = true;
      message = "";
    }
    back = { result_tf: result_tf, message: message, billInfo: request };
    return back;
  }
}
exports({ entryPoint: MyAPIHandler });