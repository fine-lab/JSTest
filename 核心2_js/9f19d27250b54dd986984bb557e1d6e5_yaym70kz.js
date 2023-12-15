let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.res;
    //查询采购合同表体
    let mess = "0";
    let queryapctsql = " select * from AT168837E809980003.AT168837E809980003.pk_fct_ap_b_ad_pu1 where dr=0 and ad_pu1_id=" + id;
    let queryapctdata = ObjectStore.queryByYonQL(queryapctsql);
    if (queryapctdata !== undefined && queryapctdata.length > 0) {
      for (let i = 0; i < queryapctdata.length; i++) {
        let linedata = queryapctdata[i];
        if (linedata.sourcechild_id !== undefined) {
          let shangyounum = linedata.cgfabodyid;
          //如果上游子表主键不等于null 查询字条子表的所有占用数量
          let querynumsql = " select sum(nastnum) as nastnum from AT168837E809980003.AT168837E809980003.pk_fct_ap_b_ad_pu1 where dr=0 and cgfabodyid=" + linedata.cgfabodyid;
          let querynumdata = ObjectStore.queryByYonQL(querynumsql);
          let num;
          if (querynumdata !== undefined) {
            num = querynumdata[0].nastnum;
          } else {
            num = 0;
          }
          var object = { id: linedata.source_id, caigob1List: [{ id: linedata.sourcechild_id, ctnum: shangyounum - num, _status: "Update" }] };
          var res = ObjectStore.updateById("AT168837E809980003.AT168837E809980003.puorder1", object, "ybdcaa4177");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });