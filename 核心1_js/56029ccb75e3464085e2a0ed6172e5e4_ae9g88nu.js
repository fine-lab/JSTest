let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 质量复查单ID-->质量复查单sourceID-->销售出库复核ID-->销售出库复核单sourceID-->查询销售出库单的sourceID
    let fcId = param.data[0].id;
    var fcSourSql = "select source_id from GT22176AT10.GT22176AT10.Sy01_quareview where id = " + fcId;
    var fcSourId = ObjectStore.queryByYonQL(fcSourSql);
    if (fcSourId.length > 0) {
      if (fcSourId[0].source_id != undefined) {
        var fcSid = fcSourId[0].source_id;
        var xsckSourSql = "select source_id from GT22176AT10.GT22176AT10.sy01_saleoutstofhv6 where id = " + fcSid;
        var xsckSid = ObjectStore.queryByYonQL(xsckSourSql);
        if (xsckSid.length > 0) {
          if (xsckSid[0].source_id != undefined) {
            var sourceId = xsckSid[0].source_id;
            var finalSql = "select id from st.salesout.SalesOuts where sourceid = " + sourceId;
            var flag = ObjectStore.queryByYonQL(finalSql, "ustock");
            if (flag.length > 0) {
              throw new Error(JSON.stringify("已有货品出库，此质量复查单不允许弃审"));
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });