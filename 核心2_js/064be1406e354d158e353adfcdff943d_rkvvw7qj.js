let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    var _status = pdata._status;
    let sqlx = "select oriTaxUnitPrice from voucher.order.OrderDetail where code= '000495'";
    var res1 = ObjectStore.queryByYonQL(sqlx, "udinghuo");
    var date = new Date(pdata.vouchdate);
    date.setHours(date.getHours() + 8);
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var strDate = date.getDate();
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + "-" + month + "-" + strDate + " 00:00:00";
    if (_status == "Update") {
      var defines = pdata.defines;
      let sql = "select * from st.purinrecord.PurInRecords where mainid=" + defines.id;
      var list = ObjectStore.queryByYonQL(sql, "ustock");
    } else {
      let sql = "select * from st.purinrecord.PurInRecords where mainid=" + pdata.id;
      var list = ObjectStore.queryByYonQL(sql, "ustock");
    }
    var purInRecords = [];
    for (var item of list) {
      purInRecords.push({
        id: item.id,
        productsku: item.productsku, ////影响库存
        productsku_cCode: item.productsku_cCode,
        makeRuleCode: item.makeRuleCode,
        costUnitPrice: item.costUnitPrice,
        autoCalcCost: item.autoCalcCost,
        memo: item.memo,
        product_cCode: item.product_cCode,
        _status: _status,
        invExchRate: item.invExchRate,
        isBatchManage: item.isBatchManage,
        sourceid: item.sourceid,
        product: item.product,
        oriSum: res1[0].oriTaxUnitPrice,
        taxUnitPriceTag: item.taxUnitPriceTag,
        source: item.source,
        subQty: item.subQty,
        product_cName: item.product_cName,
        unitName: item.unitName,
        qty: item.qty,
        oriTaxUnitPrice: item.oriTaxUnitPrice,
        unitExchangeType: item.unitExchangeType,
        sourceautoid: item.sourceautoid,
        upcode: item.upcode,
        srcBillRow: item.srcBillRow
      });
    }
    var pparam = {
      data: {
        id: defines.id,
        bizFlow: pdata.bizFlow,
        natCurrency: pdata.natCurrency,
        currency: pdata.currency,
        sourcesys: pdata.sourcesys,
        stockDirection: pdata.stockDirection,
        cust_name: pdata.cust_name,
        cLogisticsUserName: pdata.cLogisticsUserName,
        cLogisticsUserPhone: pdata.cLogisticsUserPhone,
        srcBillNO: item.srcBillNO,
        totalQuantity: pdata.totalQuantity,
        auditTime: currentdate,
        org: pdata.org,
        org_name: pdata.org_name,
        vouchdate: currentdate,
        code: pdata.code,
        bustype: "2177704243155231", ////导致交易类型未找到
        bustype_name: pdata.bustype_name,
        warehouse: pdata.warehouse,
        invoiceCust: pdata.invoiceCust,
        invoiceCust_name: pdata.invoiceCust_name,
        cust: pdata.cust,
        cLogisticsCarNum: pdata.cLogisticsCarNum,
        memo: pdata.memo,
        srcBillType: pdata.srcBillType,
        retailInvestors: pdata.retailInvestors,
        status: pdata.status,
        creator: pdata.creator,
        createTime: currentdate,
        details: purInRecords,
        _status: _status
      }
    };
    var base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: pparam
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(pparam));
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    var resp = obj.data;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    } else {
      var sucessCount = obj.data.sucessCount;
      var failCount = obj.data.failCount;
      if (failCount > 0) {
        throw new Error("失败!" + obj.data.messages[0]);
      }
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });