let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //公共变量
    let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
    let dtYesterday = new Date();
    dtYesterday.setTime(dtYesterday.getTime() - 1000 * 60 * 60 * 24);
    let fmtDtNow = funFmtDt.execute(new Date());
    let fmtDtYesterday = funFmtDt.execute(dtYesterday);
    let sql = "select id from  AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults  where isSync='0' and SAPSyncResult is null";
    let resSapSynid = ObjectStore.queryByYonQL(sql);
    var res = ObjectStore.deleteBatch("AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults", resSapSynid, "yb219003a5");
    let sqlWhere = ""; //SQL查询条件子句
    //过滤条件：【参数】accentityId【字段】accentity
    if (request.accentityId != undefined && request.accentityId != "") {
      if (sqlWhere != "") {
        sqlWhere += ` and accentity = '${request.accentityId}'`;
      } else {
        sqlWhere += ` where status = 1 and accentity = '${request.accentityId}'`;
      }
    }
    //过滤条件：【参数】sCode【字段】code
    if (request.sCode != undefined && request.sCode != "") {
      if (sqlWhere != "") {
        sqlWhere += ` and code = '${request.sCode}'`;
      } else {
        sqlWhere += ` where status = 1 and code = '${request.sCode}'`;
      }
    }
    //过滤条件：【参数】vouchdateS,vouchdateE【字段】vouchdate
    if (request.vouchdateS != undefined && request.vouchdateS != "" && request.vouchdateE != undefined && request.vouchdateE != "") {
      if (sqlWhere != "") {
        sqlWhere += ` and vouchdate between '${request.vouchdateS}' and '${request.vouchdateE}'`;
      } else {
        sqlWhere += ` where status = 1 and vouchdate between '${request.vouchdateS}' and '${request.vouchdateE}'`;
      }
    }
    if (sqlWhere == "") {
      sqlWhere = ` where status = 1 and vouchdate between '${fmtDtYesterday}' and '${fmtDtNow}'`;
    }
    sql = "select id,accentity,code,vouchdate,accountdate,period,supplier,supplier.code,oriSum,supplierbankaccount,supplierbankaccount.accountname,org from arap.paybill.PayBill ";
    sql += sqlWhere;
    let resPayable = ObjectStore.queryByYonQL(sql, "fiarap");
    for (let i = 0; i < resPayable.length; i++) {
      //根据步骤1.1查询的id在实体【AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults】中确认是否存在，【PayOrderID】
      //若存在，则此数据作废；若不存在，则进行以下的操作
      let sql = "select id from AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults where PayOrderID='" + resPayable[i].id + "'";
      let resdata = ObjectStore.queryByYonQL(sql);
      if (resdata.length == 0) {
        let body = resPayable
          .filter((x) => x.id == resPayable[i].id)
          .map((item) => {
            let newItem = item;
            newItem["PayOrderID"] = newItem["id"];
            newItem["supplierbankaccountaccountname"] = newItem["supplierbankaccount_accountname"]; //supplierbankaccountaccountname//
            newItem["isSync"] = "0"; //【是否已同步SAP】字段默认插入0
            newItem["iscreatV"] = "0"; //【凭证状态】字段默认插入0
            delete newItem.id;
            return newItem;
          });
        var res = ObjectStore.insertBatch("AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults", body, "yb219003a5List");
      }
    }
    //根据采购订单编号为空查询付款单集成SAP实体中查找数据id与付款单id
    let sqlPaydata = "select id,PayOrderID from AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults where orderno is null and isSync='0'";
    let resPaydata = ObjectStore.queryByYonQL(sqlPaydata);
    //根据查询出来的付款单id去查找采购订单编号与采购订单id并去重更新到 付款集成SAP 实体中
    for (let j = 0; j < resPaydata.length; j++) {
      let sqlPO = "select distinct mainid.id, orderno,topSrcBillId from arap.paybill.PayBillb where mainid.id='" + resPaydata[j].PayOrderID + "'";
      let resPO = ObjectStore.queryByYonQL(sqlPO, "fiarap");
      //例如，上面查询出来的数据是 [{id1,PO1,POid1}; {id2,PO2,POid2} ;...]  ；
      //那么需求要的是id={id1，id2，。。。}；orderno={PO1,PO2,...}; topSrcBillId={POid1,POid2,....}
      if (resPO.length > 0) {
        let paramOrderNos = resPO.map((x) => x.orderno).join(","); //{orderno1,orderno2,orderno3,……}
        let paramTopSrcBillIds = resPO.map((x) => x.topSrcBillId).join(","); //{topSrcBillId1,topSrcBillId2,topSrcBillId3,……}
        //根据付款单集成SAP数据id更新付款单集成SAP数据
        var object = { id: resPaydata[j].id, orderno: resPO[0].orderno, topSrcBillId: resPO[0].topSrcBillId, _status: "update" };
        var res = ObjectStore.updateById("AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults", object, "yb219003a5");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });