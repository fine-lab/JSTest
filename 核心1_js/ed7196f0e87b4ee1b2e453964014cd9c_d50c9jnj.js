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
    // 调用信息
    let func = extrequire("PU.pubFunciton.configFun");
    let funRes = func.execute();
    // 获取中外运token
    let tokenHeader = { "Content-Type": "application/x-www-form-urlencoded" };
    let tokenUrl = funRes.BASE.tokenUrl + "?userCode=" + funRes.BASE.userCode + "&key=" + funRes.BASE.key + "&sign=" + funRes.BASE.sign;
    let tokenRequestDate = getDate();
    let tokenBody = { userCode: funRes.BASE.userCode, key: funRes.BASE.key, sign: funRes.BASE.sign };
    let tokenResponse = postman("post", tokenUrl, JSON.stringify(tokenHeader), JSON.stringify(tokenBody));
    let tokenResponseDate = getDate();
    var tokenRes = JSON.parse(tokenResponse);
    // 记录日志
    try {
      let logTokenObj = { methodName: "pushLogistics", requestParams: JSON.stringify(tokenBody), requestTime: tokenRequestDate, respResult: tokenResponse, respTime: tokenResponseDate, url: tokenUrl };
      let logTokenRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logTokenObj }));
    } catch (e) {}
    if (!tokenRes || tokenRes.error || !tokenRes.object.access_token) {
      throw new Error("推送失败！获取token失败！请联系管理员！");
    }
    // 调SN信息接口
    let snBody = { data: snDetail };
    let header = { "Content-Type": "application/json", access_token: tokenRes.object.access_token };
    let snUrl = funRes.BASE.receiveSNMesUrl + "?access_token=" + tokenRes.object.access_token;
    if (params.active == "0") {
      // 撤回
      let snRequestDate = getDate();
      let apiResponseSn = postman("post", funRes.BASE.receiveSNMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(header), JSON.stringify(snBody));
      let snResponseDate = getDate();
      try {
        let logSnObj = { methodName: "pushLogistics", requestParams: JSON.stringify(snBody), requestTime: snRequestDate, respResult: apiResponseSn, respTime: snResponseDate, url: snUrl };
        let logSnRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logSnObj }));
      } catch (e) {}
      let apiResSn = JSON.parse(apiResponseSn);
      if (!apiResSn.result) {
        throw new Error("SN信息推送失败！请联系系统管理员！" + apiResponseSn);
      }
    }
    // 调到货单入库接口
    let body = { data: [params] };
    let apiRequestDate = getDate();
    let apiUrl = funRes.BASE.receiveMesUrl + "?access_token=" + tokenRes.object.access_token;
    let apiResponse = postman("post", funRes.BASE.receiveMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(header), JSON.stringify(body));
    let apiResponseDate = getDate();
    try {
      let logObj = { methodName: "pushLogistics", requestParams: JSON.stringify(body), requestTime: apiRequestDate, respResult: apiResponse, respTime: apiResponseDate, url: apiUrl };
      let logRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logObj }));
      let dd = logRes;
    } catch (e) {}
    let apiRes = JSON.parse(apiResponse);
    if (!apiRes.result) {
      if (params.active == "0") {
        // 撤回
        for (var a = 0; a < snBody.data.length; a++) {
          snBody.data[a].active = "1";
        }
        let snRequestDate = getDate();
        let apiResponseSn = postman("post", funRes.BASE.receiveSNMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(header), JSON.stringify(snBody));
        let snResponseDate = getDate();
        try {
          let logSnObj = { methodName: "pushLogistics", requestParams: JSON.stringify(snBody), requestTime: snRequestDate, respResult: apiResponseSn, respTime: snResponseDate, url: snUrl };
          let logSnRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logSnObj }));
        } catch (e) {}
      }
      throw new Error("到货单入库推送失败！请联系系统管理员！" + apiResponse);
    }
    if (params.active == "1") {
      // 提交
      let snRequestDate = getDate();
      let apiResponseSn = postman("post", funRes.BASE.receiveSNMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(header), JSON.stringify(snBody));
      let snResponseDate = getDate();
      try {
        let logSnObj = { methodName: "pushLogistics", requestParams: JSON.stringify(snBody), requestTime: snRequestDate, respResult: apiResponseSn, respTime: snResponseDate, url: snUrl };
        let logSnRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logSnObj }));
        let dd = logSnRes;
      } catch (e) {}
      let apiResSn = JSON.parse(apiResponseSn);
      if (!apiResSn.result) {
        body.data[0].active = "0";
        let validateRequestDate = getDate();
        let validateResponse = postman("post", funRes.BASE.receiveMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(header), JSON.stringify(body));
        let validateResponseDate = getDate();
        try {
          let validateLogObj = {
            methodName: "pushLogistics",
            requestParams: JSON.stringify(body),
            requestTime: validateRequestDate,
            respResult: validateResponse,
            respTime: validateResponseDate,
            url: apiUrl
          };
          let logRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: validateLogObj }));
          let dd = logRes;
        } catch (e) {}
        throw new Error("SN信息推送失败！请联系系统管理员！" + apiResponseSn);
      }
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