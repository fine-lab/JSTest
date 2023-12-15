let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
    var bodys = pdata.orderDetails;
    var paymentSchedules = pdata.receiveAgreementId_name;
    var pk_org = pdata.salesOrgId;
    var memo = pdata.memo;
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
      //内贸普通销售正式租户 1571631844908072961      测试租户1503321068665307144
      case "1571631844908072961":
        ctrantypeid = "youridHere";
        break;
      //内贸先货后款正式租户 1571632051049201674   测试租户1503322889731440649
      case "1571632051049201674":
        ctrantypeid = "youridHere";
        break;
      //内贸（定金）正式租户 1571632179915522057   测试租户1503323001413173251
      case "1571632179915522057":
        ctrantypeid = "youridHere";
        break;
      //内贸（保证金新） 正式租户 1571632360282128386   测试租户1503323156031995914
      case "1571632360282128386":
        ctrantypeid = "youridHere";
        break;
      //外贸（现款现货）正式租户 1571632566464675845       测试租户 1535255275784110084
      case "1571632566464675845":
        ctrantypeid = "youridHere";
        break;
      //外贸（先货后款）正式租户 1571632738268086275       测试租户 1570887346691244036
      case "1571632738268086275":
        ctrantypeid = "youridHere";
        break;
      //外贸（定金）正式租户 1571632849913118729       测试租户 1570887535657746439
      case "1571632849913118729":
        ctrantypeid = "youridHere";
        break;
      //  外贸（保证金）正式租户 1571632961580695558       测试租户 1570893325288341507
      case "1571632961580695558":
        ctrantypeid = "youridHere";
        break;
      case "1611617578121691139":
        ctrantypeid = "youridHere";
        break;
      case "1611617724138520579":
        ctrantypeid = "youridHere";
        break;
      case "1611617852971286535":
        ctrantypeid = "youridHere";
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
    var bb = "headFreeItem!define2";
    var huopiao = pdata[bb];
    switch (huopiao) {
      case "1571613969232166914":
        huopiao = "1001A110000000002WGP";
        break;
      default:
        huopiao = "1001A110000000002WGN";
        break;
    }
    var bb = "headFreeItem!define1_name";
    var yfjsfs = pdata[bb];
    var bb = "headFreeItem!define11"; //原销售订单号
    var yxsddh = pdata[bb];
    var bb = "headFreeItem!define8"; //核算汇率
    var hshl = pdata[bb];
    var bb = "headFreeItem!define10_name"; //价位比较
    var jwbj = pdata[bb];
    var bb = "headFreeItem!define9"; //保证金比例
    var bzjbl = pdata[bb];
    var bb = "headFreeItem!define6_name"; //尾款到款时间
    var wkdksj = pdata[bb];
    var bb = "headFreeItem!define5"; //送货地址
    var shdz = pdata[bb];
    var bb = "headFreeItem!define4_name"; //包装标准
    var bzbz = pdata[bb];
    var bb = "headFreeItem!define3"; //定金比例
    var djbl = pdata[bb];
    var bb = "headFreeItem!define7";
    var ysfs = pdata[bb];
    switch (ysfs) {
      case "1598946977905115137": //送到
        ysfs = "1001A110000000002D6T";
        break;
      case "1598947321498828809": //FOB
        ysfs = "1001A110000000002D6U";
        break;
      case "1598947158293741573": //CIF
        ysfs = "1001A110000000002D6V";
        break;
      case "1598947416002789385": //CRF
        ysfs = "1001A110000000002D6W";
        break;
      case "1598947587796762634": //贸易自提
        ysfs = "1001A1100000002E9AD7";
        break;
      case "1671817437468164128":
        ysfs = "1001A110000000318XYI";
        break;
      default:
        ysfs = "1001A110000000002D6S";
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
    var cuserid = pdata.creatorId;
    if (cuserid != null) {
      var object = {
        id: cuserid
      };
      var Userres = ObjectStore.selectById("yhtTenantBase.user.User", object);
      cuserid = Userres.mobile;
    }
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
      memo: memo,
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
      case "1566559170696052740":
        url = "http://222.134.95.58:8091/service/CreatePreOrderNcSynAbstractServlet";
        break;
      case "1566559059036864516":
        url = "http://222.134.95.58:8091/service/CreateSaleOrderNcSynAbstractServlet";
        break;
      default:
        url = "http://222.134.95.58:8091/service/CreateSaleOrderNcSynAbstractServlet";
    }
    let header = { "Content-type": "application/x-www-form-urlencoded" };
    var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var rs = JSON.parse(strResponse);
    if (rs.result == "0") {
      throw new Error(JSON.stringify(rs));
    }
    return { rs };
  }
}
exports({ entryPoint: MyAPIHandler });