let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 销售出库复核ID-->销售出库复核sourceID-->查询销售出库单的sourceID
    let billId = param.data[0].id;
    var sourSql = "select source_id from GT22176AT10.GT22176AT10.sy01_saleoutstofhv6 where id = " + billId;
    var returnSid = ObjectStore.queryByYonQL(sourSql);
    if (returnSid.length > 0) {
      if (returnSid[0].source_id != undefined) {
        var sourceId = returnSid[0].source_id;
        var finalSql = "select id from st.salesout.SalesOuts where sourceid = " + sourceId;
        var flag = ObjectStore.queryByYonQL(finalSql, "ustock");
        if (flag.length > 0) {
          throw new Error(JSON.stringify("已有货品出库，此单不允许弃审"));
        }
      }
    }
    if (context.fullname == "GT22176AT10.GT22176AT10.SY01_purinstockysv2" || context.fullname == "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6") {
      //审核人
      let updateByIdObj = { id: param.data[0].id, auditor: null, auditTime: null };
      //审核日期
      let updateByIdRes = ObjectStore.updateById(context.fullname, updateByIdObj, context.billnum);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });