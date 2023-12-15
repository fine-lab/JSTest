let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let delVoucherList = [];
    let updVoucherList = [];
    let waitVoucherList = [];
    let voucherIds = request.voucherIds;
    let execSql = "select id,voucherId,auditor,auditTime from AT1703B12408A00002.AT1703B12408A00002.voucherSync where locked=1";
    if (voucherIds != undefined && voucherIds != null && voucherIds != "") {
      let idArray = voucherIds.split(",");
      let ids = idArray.join('","');
      ids = '"' + ids + '"';
      execSql = execSql + " and id in(" + ids + ")";
    }
    execSql = execSql + " limit 100";
    let vSyncCRst = ObjectStore.queryByYonQL(execSql, "developplatform");
    for (var i in vSyncCRst) {
      let vsynObj = vSyncCRst[i];
      let id = vsynObj.id;
      let voucherId = vsynObj.voucherId;
      //获取YS凭证-无则删除，有且已审核则获取更新，否则不处理
      let voucherSql =
        "select id,org,billCode,ts,voucherKind,modifier,totalCreditGlobal,billNo,signer,otpSign,totalDebitGroup,signTime," +
        "totalDebitOrg,makeTime,accBook,auditTime,periodUnion,srcSystem,flag,creationTime,displayName,tallyTime,qtyAdjust," +
        "description,srcSystemName,totalCreditOrg,groupypd,creator,voucherType,auditor,auditTime,maker,totalDebitGlobal,tallyMan,voucherStatus,attachedBill,totalCreditGroup " +
        " from egl.voucher.VoucherBO " +
        " where id='" +
        voucherId +
        "'";
      let voucherRst = ObjectStore.queryByYonQL(voucherSql, "yonbip-fi-egl");
      if (voucherRst.length == 0) {
        //没有该凭证--删除之
        ObjectStore.deleteById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", { id: id }, "ybf4caba5e");
        delVoucherList.push(vsynObj);
      } else {
        let voucherObj = voucherRst[0];
        let auditor = voucherObj.auditor;
        let auditTime = voucherObj.auditTime;
        if (auditor != undefined && auditor != null && auditor != "") {
          let updBody = { id: id, locked: false };
          if ((vsynObj.auditor == auditor && vsynObj.auditTime == auditTime) || voucherObj.voucherStatus == "04") {
            //都没变--直接解锁
            ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", updBody, "ybf4caba5e");
            updVoucherList.push(vsynObj);
          } else {
            //更新解锁--不存在（定时任务会进行更新）
            waitVoucherList.push(vsynObj);
          }
        }
      }
    }
    let msg = "共查询到锁定数据[" + vSyncCRst.length + "]条,其中删除[" + delVoucherList.length + "]条,解锁[" + updVoucherList.length + "]条,待自动同步[" + waitVoucherList.length + "]条";
    return { rst: true, msg: msg, data: vSyncCRst };
  }
}
exports({ entryPoint: MyAPIHandler });