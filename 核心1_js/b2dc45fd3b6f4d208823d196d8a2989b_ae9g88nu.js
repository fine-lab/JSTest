let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let billlist = param.data;
    for (let i = 0; i < billlist.length; i++) {
      let data = param.data[i];
      if (data != null) {
        let id = data.id;
        let billsql = "";
        let entityName = data._entityName;
        if (entityName == "QMSQIT.incominspectorder.qms_qit_incominspectorder_h") {
          billsql = "select pk_sourcebill,pk_sourcebill_b,sourcebilltype from QMSQIT.incominspectorder.qms_qit_incominspectorder_h  where id='" + id + "'";
        }
        if (entityName == "QMSQIT.prodinspectorder.qms_qit_prodinspectorder_h") {
          billsql = "select pk_sourcebill,pk_sourcebill_b,sourcebilltype from QMSQIT.prodinspectorder.qms_qit_prodinspectorder_h  where id='" + id + "'";
        }
        let resbill = ObjectStore.queryByYonQL(billsql, "QMS-QIT");
        let sourceid = resbill[0].pk_sourcebill;
        let sourcedetailid = resbill[0].pk_sourcebill_b;
        let sourcebilltype = resbill[0].sourcebilltype;
        //委外到货
        let m_sql = "select code  from ISY_2.ISY_2.release_order where  sourcechild_id='" + sourcedetailid + "' and source_id= '" + sourceid + "'";
        if (sourcebilltype == "po_osm_arrive_order") {
          let sql1 = "select extend_release_status,arriveOrderId.*  from po.arriveorder.OsmArriveOrderProduct where id='" + sourcedetailid + "' and arriveOrderId= '" + sourceid + "'";
          let res1 = ObjectStore.queryByYonQL(sql1, "productionorder");
          let res11 = ObjectStore.queryByYonQL(m_sql, "sy01");
          if (res1 != null && res1.length > 0 && res11 != null && res11.length > 0) {
            if (res11[0].code != "") {
              let arriveOrderId_code = res1[0].arriveOrderId_code;
              throw new Error("请检源头单据委外到货单" + arriveOrderId_code + "已经执行放行操作,放行单单号" + res11[0].code + "不允许弃审。");
            }
          }
        }
        //到货单
        else if (sourcebilltype == "pu_arrivalorder") {
          let sql = "select extend_releasestatus,mainid.*  from pu.arrivalorder.ArrivalOrders where id='" + sourcedetailid + "' and mainid= '" + sourceid + "'";
          let res = ObjectStore.queryByYonQL(sql, "upu");
          let res11 = ObjectStore.queryByYonQL(m_sql, "sy01");
          if (res != null && res.length > 0 && res11 != null && res11.length > 0) {
            if (res11[0].code != "") {
              let sourcecode = res[0].mainid_code;
              throw new Error("请检来源单据采购到货单" + sourcecode + "已经执行放行操作,放行单单号" + res11[0].code + "不允许弃审。");
            }
          }
        }
        //完工报告
        else if (sourcebilltype == "po_finishedreport") {
          let sql2 = "select extend_releasestatus,finishedReportId.*  from po.finishedreport.FinishedReportDetail where id='" + sourcedetailid + "' and finishedReportId= '" + sourceid + "'";
          let res2 = ObjectStore.queryByYonQL(sql2, "productionorder");
          let res11 = ObjectStore.queryByYonQL(m_sql, "sy01");
          if (res2 != null && res2.length > 0 && res11 != null && res11.length > 0) {
            if (res11[0].code != "") {
              let sourcecode = res2[0].finishedReportId_code;
              throw new Error("请检来源单据完工报告" + sourcecode + "已经执行放行操作,放行单单号" + res11[0].code + "不允许弃审。");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });