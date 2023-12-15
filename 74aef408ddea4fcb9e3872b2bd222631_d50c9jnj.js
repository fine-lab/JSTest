let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取参数
    let data = param.data;
    let ids = data.map((item, i) => {
      return item.id;
    });
    let snInSqlCond = "('" + ids.join("','") + "')";
    let yonQl =
      "select *,receiverCustId.name,transactionTypeId.code,(select *,productId.code,productId.name from deliveryDetails) deliveryDetails,t1.name as destProvinceName,t2.name as destCityName  from voucher.delivery.DeliveryVoucher ";
    yonQl += "left join aa.regioncorp.RegionCorp t1 on extendDestProvince = t1.id ";
    yonQl += "left join aa.regioncorp.RegionCorp t2 on extendDestCity = t2.id ";
    yonQl += "where id in " + snInSqlCond;
    var res = ObjectStore.queryByYonQL(yonQl);
    res = res.filter((item, i) => {
      if (item.transactionTypeId_code == "BJ001" || item.transactionTypeId_code == "BJ001") {
        return item;
      }
    });
    let syncParam = [];
    res.map((item, i) => {
      let sysObj = {};
      //出库订单号
      sysObj.orderNo = item.code;
      //到货单主表ID
      sysObj.sourceId = item.id;
      //收货客户名称
      sysObj.consigneeName = item.receiverCustId_name;
      //配送方式 自提（客户自提）、配送（中外运）
      if (item.extendDeliveryMethod && item.extendDeliveryMethod == "1") {
        sysObj.deliveryMethod = "自提";
      } else if (item.extendDeliveryMethod && item.extendDeliveryMethod == "2") {
        sysObj.deliveryMethod = "配送";
      }
      //收货人
      sysObj.consignee = item.extendConsignee;
      //收货人联系电话
      sysObj.consigneeTel = item.extendConsigneeTel;
      //目的省份
      sysObj.destProvince = item.destProvinceName;
      //目的城市
      sysObj.destCity = item.destCityName;
      //客户收货地址
      sysObj.consigneeAdr = item.extendConsigneeAdr;
      //订单状态 0:作废，1:新增"
      sysObj.active = "1";
      //表体字段
      let details = [];
      let deliveryDetails = item.deliveryDetails;
      if (!deliveryDetails || deliveryDetails == null) {
        syncParam.push(sysObj);
        return;
      }
      let iAuxUnitQuantity = 0;
      deliveryDetails.map((child, j) => {
        let detail = {};
        detail.seqNo = "" + child.lineno;
        detail.soNo = child.orderNo;
        detail.soSeqNo = child.uplineno;
        detail.sourceAutoId = child.id;
        detail.itemCode = child.productId_code;
        detail.itemDesc = child.productId_name;
        detail.itemBoxQty = child.extendItemBoxQty;
        detail.qty = child.auxUnitQuantity;
        detail.uom = child.productUnitName;
        detail.REMARK = child.remark;
        if (child.auxUnitQuantity != null) {
          iAuxUnitQuantity = iAuxUnitQuantity + Number(child.auxUnitQuantity);
        }
        details.push(detail);
      });
      //订单类型 订单类型	VARCHAR2	50	Y	"销售发货表体：发货数量>0传“销售出库”，反之传“销售退货”； 销售出库（出库单、正数）、销售退货（入库单、负数）"
      if (iAuxUnitQuantity > 0) {
        sysObj.orderType = "Sales delivery";
      } else {
        sysObj.orderType = "Sales return";
      }
      sysObj.detail = details;
      syncParam.push(sysObj);
    });
    let func = extrequire("PU.pubFunciton.configFun");
    let funRes = func.execute();
    let tokenHeader = { "Content-Type": "application/x-www-form-urlencoded" };
    let tokenUrl = funRes.BASE.tokenUrl + "?userCode=" + funRes.BASE.userCode + "&key=" + funRes.BASE.key + "&sign=" + funRes.BASE.sign;
    let tokenBody = { userCode: funRes.BASE.userCode, key: funRes.BASE.key, sign: funRes.BASE.sign };
    let tokenResponse = postman("post", tokenUrl, JSON.stringify(tokenHeader), JSON.stringify(tokenBody));
    tokenResponse = JSON.parse(tokenResponse);
    let saveLog = {};
    saveLog.methodName = "syncDelivery";
    saveLog.requestTime = getDate();
    let url = funRes.BASE.deliveryToZyyUrl;
    let header = { access_token: tokenResponse.object.access_token };
    saveLog.requestParams = JSON.stringify({ data: syncParam });
    let apiResponse = postman("post", url, JSON.stringify(header), JSON.stringify({ data: syncParam }));
    saveLog.respResult = apiResponse;
    apiResponse = JSON.parse(apiResponse);
    //添加日
    saveLog.respTime = getDate();
    saveLog.errorMsg = apiResponse.errorMsg;
    saveLog.url = url;
    let saveLogRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "SCMSA", JSON.stringify({ logObj: saveLog }));
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