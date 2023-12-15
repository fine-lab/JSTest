let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    if ((data[0].busType_name != "备件到货" && data[0].busType_name != "备件退货") || data[0].extendLogisticStatus == "2") {
      // 备件到货、备件退货、已提交
      return {};
    }
    // 查询数据，准备拼接
    let sql =
      "select vendor,code orderNo,id sourceId,vendor.code supplierCode,vendor.name supplierName,extendExpressName expressName,extendTractorNo tractorNo,extendDriverName driverName,purchaseOrg.name custName,extendEst est,extendDriverTel driverTel, ";
    sql += " detail.lineno seqNo,detail.upcode poNo,detail.upLineno poLineNo,detail.id sourceAutoId,detail.product.cCode itemCode,detail.productDesc itemDesc,detail.qty qty,detail.unit.name uom,";
    sql += " snDetail.extendBoxNumber packageNo,snDetail.extendSn sn,snDetail.extendBoxCount itemBoxQty ";
    sql += " from pu.arrivalorder.ArrivalOrder";
    sql += " inner join pu.arrivalorder.ArrivalOrders detail on detail.mainid = id ";
    sql += " inner join pu.arrivalorder.snMessage snDetail on snDetail.ArrivalOrders_id = detail.id ";
    sql += " where id = " + data[0].id;
    var res = ObjectStore.queryByYonQL(sql, "upu");
    var detailMap = new Map();
    var header = {};
    var resDetails = [];
    var snDetail = [];
    for (var i = 0; i < res.length; i++) {
      let resData = res[i];
      if (JSON.stringify(header) == "{}") {
        if (resData.qty > 0) {
          header.asnType = "Purchase receipt";
        } else {
          header.asnType = "Purchase return";
        }
        let vsql = "select code supplierCode,con.contactmobile,con.defaultcontact,con.contactphone,con.contactname from aa.vendor.Vendor ";
        vsql += " inner join aa.vendor.VendorContacts con on con.vendor = id ";
        vsql += " where id = " + resData.vendor;
        var vres = ObjectStore.queryByYonQL(vsql, "yssupplier");
        let contact = vres[0];
        for (let j = 0; j < vres.length; j++) {
          if (vres[j].defaultcontact) {
            contact = vres[j];
            break;
          }
        }
        header.contact = contact.con_contactname;
        if (contact.con_contactmobile) {
          header.telNo = contact.con_contactmobile;
        } else {
          header.telNo = contact.con_contactphone;
        }
        header.orderNo = resData.orderNo;
        header.sourceId = resData.sourceId;
        header.supplierName = resData.supplierName;
        header.supplierCode = resData.supplierCode;
        header.expressName = resData.expressName;
        header.tractorNo = resData.tractorNo;
        header.driverName = resData.driverName;
        header.custName = resData.custName;
        header.distination = "东莞良边仓";
        header.est = resData.est;
        header.driverTel = resData.driverTel;
        header.active = "1";
        // 非必填字段设置
        if (!header.telNo) {
          header.telNo = "";
        }
        if (!header.contact) {
          header.contact = "";
        }
        if (!header.expressName) {
          header.expressName = "";
        }
        if (!header.tractorNo) {
          header.tractorNo = "";
        }
        if (!header.driverName) {
          header.driverName = "";
        }
        if (!header.est) {
          header.est = "";
        }
        if (!header.driverTel) {
          header.driverTel = "";
        }
      }
      if (!detailMap.has(resData.sourceAutoId)) {
        detailMap.set(resData.sourceAutoId, 1);
        let resDetail = {};
        resDetail.seqNo = resData.seqNo;
        resDetail.poNo = resData.poNo;
        resDetail.poLineNo = resData.poLineNo;
        resDetail.sourceAutoId = resData.sourceAutoId;
        resDetail.itemCode = resData.itemCode;
        resDetail.itemDesc = resData.itemDesc;
        resDetail.itemBoxQty = resData.itemBoxQty;
        resDetail.qty = resData.qty;
        resDetail.uom = resData.uom;
        resDetail.remark = "";
        resDetails.push(resDetail);
      }
      let snData = {};
      snData.active = "1";
      snData.orderNo = resData.orderNo;
      snData.seqNo = resData.seqNo;
      snData.itemCode = resData.itemCode;
      snData.packageNo = resData.packageNo;
      snData.sn = resData.sn;
      snData.remark = "";
      snDetail.push(snData);
    }
    header.detail = resDetails;
    let headerArr = [];
    headerArr.push(header);
    let logistic = { data: headerArr };
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
    let logTokenObj = { methodName: "auditPushLogi", requestParams: JSON.stringify(tokenBody), requestTime: tokenRequestDate, respResult: tokenResponse, respTime: tokenResponseDate, url: tokenUrl };
    let logTokenRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logTokenObj }));
    if (!tokenRes || tokenRes.error || !tokenRes.object.access_token) {
      return {};
    }
    // 调到货单入库接口
    let apiHeader = { "Content-Type": "application/json", access_token: tokenRes.object.access_token };
    let apiRequestDate = getDate();
    let apiUrl = funRes.BASE.receiveMesUrl + "?access_token=" + tokenRes.object.access_token;
    let apiResponse = postman("post", funRes.BASE.receiveMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(apiHeader), JSON.stringify(logistic));
    let apiResponseDate = getDate();
    let logObj = { methodName: "auditPushLogi", requestParams: JSON.stringify(logistic), requestTime: apiRequestDate, respResult: apiResponse, respTime: apiResponseDate, url: apiUrl };
    let logRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logObj }));
    let apiRes = JSON.parse(apiResponse);
    if (!apiRes.result) {
      return {};
    }
    // 调SN信息接口
    let snBody = { data: snDetail };
    let snRequestDate = getDate();
    let snUrl = funRes.BASE.receiveSNMesUrl + "?access_token=" + tokenRes.object.access_token;
    let apiResponseSn = postman("post", funRes.BASE.receiveSNMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(apiHeader), JSON.stringify(snBody));
    let snResponseDate = getDate();
    let logSnObj = { methodName: "auditPushLogi", requestParams: JSON.stringify(snBody), requestTime: snRequestDate, respResult: apiResponseSn, respTime: snResponseDate, url: snUrl };
    let logSnRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logSnObj }));
    let apiResSn = JSON.parse(apiResponseSn);
    if (!apiResSn.result) {
      // 将到货单入库失效
      logistic.data[0].active = "0";
      let validateRequestDate = getDate();
      let validateResponse = postman("post", funRes.BASE.receiveMesUrl + "?access_token=" + tokenRes.object.access_token, JSON.stringify(apiHeader), JSON.stringify(logistic));
      let validateResponseDate = getDate();
      let validateLogObj = {
        methodName: "auditPushLogi",
        requestParams: JSON.stringify(logistic),
        requestTime: validateRequestDate,
        respResult: validateResponse,
        respTime: validateResponseDate,
        url: apiUrl
      };
      let validateLogRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: validateLogObj }));
      return {};
    }
    // 设置推送状态
    data[0].set("extendLogisticStatus", "2");
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
exports({ entryPoint: MyTrigger });