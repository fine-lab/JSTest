let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = param.data;
    var id = requestData[0].id;
    var object = {
      id: id
    };
    var agghead = ObjectStore.selectById("voucher.order.Order", object);
    var billno = agghead.code;
    var billid = agghead.id;
    var sql = "select agentId.name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    var ccustomerid = res[0].agentId;
    var object = {
      id: ccustomerid
    };
    var Customerres = ObjectStore.selectById("aa.merchant.Merchant", object);
    var transtype = Customerres.transType;
    var ccustomerid = Customerres.code;
    var ctrantypeid = agghead.transactionTypeId;
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
    var cdeptid = agghead.saleDepartmentId;
    if (cdeptid != null) {
      var object = {
        id: cdeptid
      };
      var deptres = ObjectStore.selectById("org.func.Dept", object);
      var cdeptid = deptres.objid;
    }
    var cbalancetypename = "";
    var sql = "select settlement.name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    cbalancetypename = res[0].settlement_name;
    var cbalancetypeid = agghead.settlement;
    var object = {
      id: cbalancetypeid
    };
    var cbalancetyperes = ObjectStore.selectById("aa.settlemethod.SettleMethod", object);
    var cbalancetypeid = cbalancetyperes.erpCode;
    var cemployeeid = agghead.corpContact;
    var cuserid = "";
    if (cemployeeid != null) {
      var object = {
        id: cemployeeid
      };
      var cemployeeidres = ObjectStore.selectById("bd.staff.Staff", object);
      cuserid = cemployeeidres.mobile;
      if (cuserid.length > 11) {
        cuserid = cuserid.substring(cuserid.length - 11, cuserid.length);
      }
      var cemployeeid = cemployeeidres.objid;
    }
    var settlement = agghead.settlement;
    var sql1 =
      "select   id,orderDetailDefineCharacter.attrext12.name as bodyFreeItem_define1_name,orderDetailDefineCharacter.attrext13 as bodyFreeItem_define2 ,orderDetailDefineCharacter.attrext14 as bodyFreeItem_define3 ,orderDetailDefineCharacter.attrext15 as bodyFreeItem_define4 ,orderDetailDefineCharacter.attrext16 as bodyFreeItem_define5 ,orderDetailDefineCharacter.attrext17 as bodyFreeItem_define6 ,orderDetailDefineCharacter.attrext18 as bodyFreeItem_define7 ,orderDetailDefineCharacter.attrext19 as bodyFreeItem_define8 ,productId ,subQty,oriSum,oriTaxUnitPrice,taxRate from   voucher.order.OrderDetail   where orderId =" +
      id;
    var res = ObjectStore.queryByYonQL(sql1);
    var entrys = [];
    for (var i = 0; i < res.length; i++) {
      var pk_material = res[i].productId;
      var object = {
        id: pk_material
      };
      var materialres = ObjectStore.selectById("pc.product.Product", object);
      var pk_material = materialres.erpCode;
      var bodyi = {
        bodyid: res[i].id,
        pk_material: pk_material,
        nnum: res[i].subQty,
        norigtaxmny: res[i].oriSum,
        norigtaxprice: res[i].oriTaxUnitPrice,
        taxRate: res[i].taxRate,
        defineinfo1: res[i].bodyFreeItem_define1_name,
        defineinfo2: res[i].bodyFreeItem_define2,
        defineinfo3: res[i].bodyFreeItem_define3,
        defineinfo4: res[i].bodyFreeItem_define4,
        defineinfo5: res[i].bodyFreeItem_define5,
        defineinfo6: res[i].bodyFreeItem_define6,
        defineinfo7: res[i].bodyFreeItem_define7,
        defineinfo8: res[i].bodyFreeItem_define8
      };
      entrys.push(bodyi);
    }
    var paymentSchedules = "";
    var sql = "select receiveAgreementId.name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      paymentSchedules = res[0].receiveAgreementId_name;
    }
    var yxsddh = "";
    var sql = "select orderDefineCharacter.attrext11 as headFreeItem_define11 from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      yxsddh = res[0].headFreeItem_define11;
    }
    var hshl = "";
    var sql = "select orderDefineCharacter.attrext8 as headFreeItem_define8  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      hshl = res[0].headFreeItem_define8;
    }
    var jwbj = "";
    var sql = "select orderDefineCharacter.attrext10.name as headFreeItem_define10_name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      jwbj = res[0].headFreeItem_define10_name;
    }
    var bzjbl = "";
    var sql = "select orderDefineCharacter.attrext9 as headFreeItem_define9  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      bzjbl = res[0].headFreeItem_define9;
    }
    var wkdksj = "";
    var sql = "select orderDefineCharacter.attrext6.name as headFreeItem_define6_name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      wkdksj = res[0].headFreeItem_define6_name;
    }
    var shdz = "";
    var sql = "select orderDefineCharacter.attrext5 as headFreeItem_define5  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      shdz = res[0].headFreeItem_define5;
    }
    var bzbz = "";
    var sql = "select orderDefineCharacter.attrext4.name as headFreeItem_define4_name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      bzbz = res[0].headFreeItem_define4_name;
    }
    var yfjsfs = "";
    var sql = "select orderDefineCharacter.attrext1.name as headFreeItem_define1_name  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      yfjsfs = res[0].headFreeItem_define1_name;
    }
    var djbl = "";
    var sql = "select orderDefineCharacter.attrext3 as headFreeItem_define3  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      djbl = res[0].headFreeItem_define3;
    }
    var ysfs = "";
    var sql = "select orderDefineCharacter.attrext33 as headFreeItem_define7  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      ysfs = res[0].headFreeItem_define7;
    }
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
    var currency = "";
    var sql1 = "select     orderPrices.currency.objid  from   voucher.order.Order   where id =" + id;
    var res = ObjectStore.queryByYonQL(sql1);
    if (res.length > 0) {
      currency = res[0].orderPrices_currency_objid;
    }
    var orderDate = agghead.orderDate;
    var huopiao = "";
    var sql = "select orderDefineCharacter.attrext2 as headFreeItem_define2  from voucher.order.Order  where  id =" + id;
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      huopiao = res[0].headFreeItem_define2;
      switch (huopiao) {
        case "1571613969232166914":
          huopiao = "1001A110000000002WGP";
          break;
        default:
          huopiao = "1001A110000000002WGN";
          break;
      }
    }
    var memo = agghead.memo;
    var pk_org = agghead.salesOrgId;
    var object = {
      id: pk_org
    };
    var salesorgres = ObjectStore.selectById("org.func.BaseOrg", object);
    var pk_org = salesorgres.objid;
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
    console.error(JSON.stringify(body));
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
    if (Customerres != null) {
      var orgid = Customerres.orgId;
      var code = Customerres.code;
      var id = Customerres.id;
      var name = Customerres.name;
      var body = {
        data: {
          createOrg: orgid,
          code: code,
          belongOrg: orgid,
          id: id,
          name: name,
          _status: "Update",
          merchantDefine: {
            id: id,
            define14: "是",
            _status: "Update"
          }
        }
      };
      let func1 = extrequire("SCMSA.backDesignerFunction.getBIPtoken");
      let access_token = func1.execute();
      let header = { "Content-type": "application/json" };
      let apiResponse = postman("post", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(body));
      console.error(JSON.stringify(apiResponse));
    }
    return { rs };
  }
}
exports({ entryPoint: MyTrigger });