let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    var bodys = pdata.orderDetails;
    for (var i = 0; i < bodys.length; i++) {
      var taxRate = bodys[i].taxRate;
      throw new Error(taxRate > 110);
    }
    var bodys = pdata.orderDetails;
    var paymentSchedules = pdata.receiveAgreementId_name;
    var pk_org = pdata.salesOrgId;
    var object = {
      id: pk_org
    };
    var salesorgres = ObjectStore.selectById("org.func.BaseOrg", object);
    var pk_org = salesorgres.objid;
    var billid = pdata.id;
    var billno = pdata.code;
    var ccustomerid = pdata.agentId;
    var object = {
      id: ccustomerid
    };
    var Customerres = ObjectStore.selectById("aa.merchant.Merchant", object);
    var transtype = Customerres.transType;
    var ccustomerid = Customerres.code;
    var ctrantypeid = pdata.transactionTypeId;
    switch (ctrantypeid) {
      case "1503321068665307144":
        ctrantypeid = "youridHere";
        break;
      case "1503322889731440649":
        ctrantypeid = "youridHere";
        break;
      case "1503323001413173251":
        ctrantypeid = "youridHere";
        break;
      case "1503323156031995914":
        ctrantypeid = "youridHere";
        break;
      case "1535255275784110084":
        ctrantypeid = "youridHere";
        break;
      case "1570887346691244036":
        ctrantypeid = " 1001A11000000000RRLB";
        break;
      case "1570887535657746439":
        ctrantypeid = " 1001A11000000000RRLH";
        break;
      case "1570893325288341507":
        ctrantypeid = " 1001A11000000000RRLN";
        break;
      default:
        break;
    }
    var cdeptid = pdata.saleDepartmentId;
    if (cdeptid != null) {
      var object = {
        id: cdeptid
      };
      var deptres = ObjectStore.selectById("org.func.Dept", object);
      var cdeptid = deptres.objid;
    }
    var cbalancetypename = pdata.settlement_name;
    var cbalancetypeid = pdata.settlement;
    var object = {
      id: cbalancetypeid
    };
    var cbalancetyperes = ObjectStore.selectById("aa.settlemethod.SettleMethod", object);
    var cbalancetypeid = cbalancetyperes.erpCode;
    var cemployeeid = pdata.corpContact;
    if (cemployeeid != null) {
      var object = {
        id: cemployeeid
      };
      var cemployeeidres = ObjectStore.selectById("bd.staff.Staff", object);
      var cemployeeid = cemployeeidres.objid;
    }
    var settlement = pdata.settlement;
    var bb = "headFreeItem!define1";
    var huopiao = pdata[bb];
    switch (huopiao) {
      case "1503241465754025991":
        huopiao = "1001A110000000002WGN";
        break;
      //一票
      case "1503241525855780873":
        huopiao = "1001A110000000002WGP";
        break;
      default:
        break;
    }
    var bb = "headFreeItem!define8_name";
    var yfjsfs = pdata[bb];
    var bb = "headFreeItem!define9"; //原销售订单号
    var yxsddh = pdata[bb];
    var bb = "headFreeItem!define10"; //核算汇率
    var hshl = pdata[bb];
    var bb = "headFreeItem!define11_name"; //价位比较
    var jwbj = pdata[bb];
    var bb = "headFreeItem!define12"; //保证金比例
    var bzjbl = pdata[bb];
    var bb = "headFreeItem!define13_name"; //尾款到款时间
    var wkdksj = pdata[bb];
    var bb = "headFreeItem!define14"; //送货地址
    var shdz = pdata[bb];
    var bb = "headFreeItem!define15_name"; //包装标准
    var bzbz = pdata[bb];
    var bb = "headFreeItem!define16"; //定金比例
    var djbl = pdata[bb];
    var bb = "headFreeItem!define5";
    var ysfs = pdata[bb];
    switch (ysfs) {
      case "1502664488427454481": //自提
        ysfs = "1001A110000000002D6S";
        break;
      case "1502664488427454485": //送到
        ysfs = "1001A110000000002D6T";
        break;
      case "1502664488427454478": //FOB
        ysfs = "1001A110000000002D6U";
        break;
      case "1502664488427454471": //CIF
        ysfs = "1001A110000000002D6V";
        break;
      case "1502664488427454475": //CRF
        ysfs = "1001A110000000002D6W";
        break;
      default:
        break;
    }
    var aa = "orderPrices!currency";
    var currency = pdata[aa];
    var object = {
      id: currency
    };
    var currencyres = ObjectStore.selectById("bd.currencytenant.CurrencyTenantVO", object);
    var currency = currencyres.objid;
    var orderDate = pdata.orderDate;
    var cuserid = "youridHere";
    //实体查询模板
    var entrys = [];
    for (var i = 0; i < bodys.length; i++) {
      var idstr = "orderDetailPrices!orderDetailId";
      var taxRate = bodys[i].taxRate;
      var bodyid = bodys[i][idstr];
      var pk_material = bodys[i].productId;
      var object = {
        id: pk_material
      };
      var materialres = ObjectStore.selectById("pc.product.Product", object);
      var pk_material = materialres.erpCode;
      var nnum = bodys[i].subQty;
      var norigtaxmny = bodys[i].oriSum;
      var norigtaxprice = bodys[i].oriTaxUnitPrice;
      var vbdef1 = "bodyFreeItem!define1_name";
      var defineinfo1 = bodys[i][vbdef1];
      var vbdef2 = "bodyFreeItem!define2";
      var defineinfo2 = bodys[i][vbdef2];
      var vbdef3 = "bodyFreeItem!define3";
      var defineinfo3 = bodys[i][vbdef3];
      var vbdef4 = "bodyFreeItem!define4";
      var defineinfo4 = bodys[i][vbdef4];
      var vbdef5 = "bodyFreeItem!define5";
      var defineinfo5 = bodys[i][vbdef5];
      var vbdef6 = "bodyFreeItem!define6";
      var defineinfo6 = bodys[i][vbdef6];
      var vbdef7 = "bodyFreeItem!define7";
      var defineinfo7 = bodys[i][vbdef7];
      var vbdef8 = "bodyFreeItem!define8";
      var defineinfo8 = bodys[i][vbdef8];
      var bodyi = {
        bodyid: bodyid,
        pk_material: pk_material,
        nnum: nnum,
        norigtaxmny: norigtaxmny,
        norigtaxprice: norigtaxprice,
        taxRate: taxRate,
        defineinfo1: defineinfo1,
        defineinfo2: defineinfo2,
        defineinfo3: defineinfo3,
        defineinfo4: defineinfo4,
        defineinfo5: defineinfo5,
        defineinfo6: defineinfo6,
        defineinfo7: defineinfo7,
        defineinfo8: defineinfo8
      };
      entrys.push(bodyi);
    }
    var body = {
      operation: "C",
      billno: billno,
      billid: billid,
      huopiao: huopiao,
      pk_org: pk_org,
      ccustomerid: ccustomerid,
      cdeptid: cdeptid,
      ctrantypeid: ctrantypeid,
      cemployeeid: cemployeeid,
      billdate: orderDate,
      corigcurrencyid: currency,
      cuserid: cuserid,
      cbalancetypeid: cbalancetypeid,
      cbalancetypename: cbalancetypename,
      vnote: "测试",
      ysfs: ysfs,
      yfjsfs: yfjsfs,
      djbl: djbl,
      bzbz: bzbz,
      hshl: hshl,
      shdz: shdz,
      wkdksj: wkdksj,
      bzjbl: bzjbl,
      jwbj: jwbj,
      yxsddh: yxsddh,
      paymentSchedules: paymentSchedules,
      linemsg: entrys
    };
    var url = "";
    switch (transtype) {
      case "1503408179183616007":
        url = "http://222.134.95.58:8088/service/CreatePreOrderNcSynAbstractServlet";
        break;
      case "1503408119047258122":
        url = "http://222.134.95.58:8088/service/CreateSaleOrderNcSynAbstractServlet";
        break;
      default:
        url = "http://222.134.95.58:8088/service/CreateSaleOrderNcSynAbstractServlet";
    }
    throw new Error(JSON.stringify(body));
    let header = { "Content-type": "application/x-www-form-urlencoded" };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var rs = JSON.parse(strResponse);
    if (rs.result == "0") {
      throw new Error(JSON.stringify(rs));
    }
    return {
      rs
    };
  }
}
exports({ entryPoint: MyTrigger });