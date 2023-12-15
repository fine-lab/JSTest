let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取参数
    let data = request.params;
    let appCode = "PU";
    let ids = data.map((item, i) => {
      return item.id;
    });
    if (ids.length == 0) {
      return { message: "未选中数据" };
    }
    let snInSqlCond = "('" + ids.join("','") + "')";
    let yonQl =
      "select *,product,purchaseSourceId,purchaseSourceAutoId,taxitems.code,product.model as productModel,purchaseOrders.extendProDeliTime as purchaseExtendProDeliTime,purchase.code as purchaseCode,purchase.vouchdate as purchaseVouchdate from pu.arrivalorder.ArrivalOrders ";
    yonQl += "left join  pc.product.Product product on product = product.id ";
    yonQl += "left join  pu.purchaseorder.PurchaseOrder purchase on sourceid = purchase.id ";
    yonQl += "left join  pu.purchaseorder.PurchaseOrders purchaseOrders on sourceautoid = purchaseOrders.id ";
    yonQl += "where mainid in " + snInSqlCond;
    var res = ObjectStore.queryByYonQL(yonQl);
    if (res.length == 0) {
      return { message: "无需同步" };
    }
    res.map((item, i) => {
      let syncParam = {};
      //供应商工厂代码
      syncParam.vdFactoryCode = "Z06GIM-001";
      // 客户代码
      syncParam.customerVendorCode = "Z06GIM";
      // 采购物料编码 根据到货单物料编码在物料档案的"型号"
      syncParam.itemCode = item.productModel;
      // 采购模式 NORMAL
      syncParam.businessMode = "NORMAL";
      // 采购物料Open PO号 根据到货单追溯查询采购订单编号
      syncParam.poNumber = item.purchaseCode;
      syncParam.poPublishDateStr = item.purchaseVouchdate.toString().substr(0, 10);
      // 要求到料时间
      syncParam.openPoQuantity = item.qty;
      syncParam.promisedDeliveryDateStr = item.purchaseExtendProDeliTime;
      // 华为指定供应商Code
      syncParam.componentVendorCode = "Z06GIM";
      let func = extrequire("PU.pubFunciton.configFun");
      let funRes = func.execute();
      let saveLog = {};
      saveLog.methodName = "sysncPurToHw";
      saveLog.requestParams = JSON.stringify({ sccOpenPOList: [syncParam] });
      saveLog.requestTime = getDate();
      // 下级供应商名称
      let header = { "X-HW-ID": funRes.BASE.XHWID, "X-HW-APPKEY": funRes.BASE.XHWAPPKEY };
      let strResponse = postman("POST", funRes.BASE.arrivalToHWUrl, JSON.stringify(header), JSON.stringify({ sccOpenPOList: [syncParam] }));
      let jsonRes = JSON.parse(strResponse);
      let extendSynHw = jsonRes.success;
      let extendSynHwFailRea = jsonRes.errorMessage;
      //添加日志
      saveLog.respResult = strResponse;
      saveLog.respTime = getDate();
      saveLog.errorMsg = jsonRes.errorMsg;
      saveLog.url = funRes.BASE.arrivalToHWUrl;
      let saveLogRes = openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: saveLog }));
      let url = funRes.BASE.arrivalDetailUrl;
      let apiResponse = openLinker("GET", url + "?id=" + item.mainid, appCode, null);
      jsonRes = JSON.parse(apiResponse);
      let body = {};
      body.resubmitCheckKey = new Date().getTime().toString();
      body.id = item.mainid;
      body.purchaseOrg = jsonRes.data.purchaseOrg;
      body.org = jsonRes.data.org;
      body.inInvoiceOrg = jsonRes.data.inInvoiceOrg;
      body.isContract = jsonRes.data.isContract;
      body.vouchdate = jsonRes.data.vouchdate;
      body.busType = jsonRes.data.busType;
      body["vendor"] = jsonRes.data["vendor"];
      body.invoiceSupplier = jsonRes.data.invoiceSupplier;
      body.currency = jsonRes.data.currency;
      body.natCurrency = jsonRes.data.natCurrency;
      body.exchRateType = jsonRes.data.exchRateType;
      body.exchRate = jsonRes.data.exchRate;
      body._status = "Update";
      body.code = jsonRes.data.code;
      body.extendSynHw = extendSynHw;
      body.extendSynHwFailRea = extendSynHwFailRea;
      let queryArrivalOrders = jsonRes.data.arrivalOrders;
      let arrivalOrder = {};
      queryArrivalOrders.map((order, i) => {
        if (order.id == item.id) {
          arrivalOrder = {
            id: item.id,
            _status: "Update",
            extendSynHw: extendSynHw,
            extendSynHwFailRea: extendSynHwFailRea,
            source: order["source"],
            makeRuleCode: order.makeRuleCode,
            product: order["product"],
            oriUnitPrice: order.oriUnitPrice,
            oriTaxUnitPrice: order.oriTaxUnitPrice,
            oriMoney: order.oriMoney,
            oriSum: order.oriSum,
            oriTax: order.oriTax,
            taxitems_code: item.taxitems_code,
            natUnitPrice: order.natUnitPrice,
            natTaxUnitPrice: order.natTaxUnitPrice,
            natMoney: order.natMoney,
            natSum: order.natSum,
            natTax: order.natTax,
            qty: order.qty,
            sourceautoid: order.sourceautoid,
            sourceid: order.sourceid,
            unit: order.unit,
            purUOM: order.purUOM,
            invExchRate: order.invExchRate,
            priceUOM: order.priceUOM,
            invPriceExchRate: order.invPriceExchRate,
            unitExchangeType: order.unitExchangeType,
            isLogisticsRelated: order.isLogisticsRelated,
            unitExchangeTypePrice: order.unitExchangeTypePrice,
            subQty: order.subQty,
            priceQty: order.priceQty,
            productsku: order.productsku,
            firstsourceautoid: order.firstsourceautoid,
            firstsource: order.firstsource,
            firstupcode: order.firstupcode,
            isGift: order.isGift,
            firstsourceid: order.firstsourceid,
            taxRate: order.taxRate,
            upcode: order.upcode,
            taxitems: order.taxitems,
            discountTaxType: order.discountTaxType
          };
          return arrivalOrder;
        }
      });
      body.arrivalOrders = [arrivalOrder];
      let saveParam = JSON.stringify({ data: body });
      let saveUrl = funRes.BASE.arrivalSaveUrl;
      let saveResponse = openLinker("POST", saveUrl, appCode, saveParam);
      let savejsonRes = JSON.parse(saveResponse);
      if (savejsonRes.code != 200) {
        throw new Error(saveResponse);
      }
    });
    return { data: "同步成功,回写成功" };
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